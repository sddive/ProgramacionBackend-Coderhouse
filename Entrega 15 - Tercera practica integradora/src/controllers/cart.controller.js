import { cartService } from "../services/cart.services.js";
import { productService } from "../services/product.services.js";
import { ticketService } from "../services/ticket.services.js";
import { CustomError } from "../utils/customError.js";
import { STATUS_CODES } from "../utils/codeError.js";
import { errorHandler } from "../middleware/errorHandler.js";
import mongoose from "mongoose";

export default class CartController {

    async addCart(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let cart = await cartService.addCart()
            if (Object.entries(cart).length === 0){
                req.logger.error(`No se pudo crear el carrito`)
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'cart could not be created')
            } else {
                req.logger.info(`Carrito ${cart.id} creado`)
                res.status(200).json({ status: 'success', error: `cart ${cart.id} created` })
            } 
        } catch (error) {
            errorHandler(error, req, res)
        }  
    }
    
    async getProductsToCart(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let idCart = req.params.cid
            if(!mongoose.Types.ObjectId.isValid(idCart)){
                req.logger.http(`El carrito ${cart.id} no existe`)
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            }
            let productsToCart = await cartService.getProductsToCart(idCart)
            if (!productsToCart){
                req.logger.info(`No se pudieron acceder a los productos del carrito`)
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({products: productsToCart})
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async addProduct (req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let user = req.user
            const {cid, pid} = req.params
            if(!mongoose.Types.ObjectId.isValid(cid)){
                req.logger.http(`El carrito ${cid} no existe`)
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            }
            if(!mongoose.Types.ObjectId.isValid(pid)){
                req.logger.http(`El carrito ${pid} no existe`)
                throw new CustomError('product not found', STATUS_CODES.NOT_FOUND, 'The product does not exist, enter a valid one')
            }
            let product = await productService.getProductById(pid)
            if (product){
                if (product.owner === user.email){
                    throw new CustomError('is the owner of product', STATUS_CODES.ERROR_ARGUMENTOS, 'The owner cannot add his products')
                }
            }
            const cart = await cartService.addProduct(cid, pid)
            if (!cart){
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({ status: 'success', message: 'product added to cart successfully' })
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async updateProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.updateProduct(req.params.cid, req.params.pid, parseInt(req.body.quantity))
            if (!cart){
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({ status: 'success', message: 'quantity updated successfully' })
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async updateAllProducts(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.updateAllProducts(req.params.cid, req.body.products)
            if (!cart){
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({ status: 'success', message: 'cart update successfully' })
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async deleteProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.deleteProduct(req.params.cid, req.params.pid)
            if (!cart){
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({ status: 'success', message: 'product deleted to cart successfully' })
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async deleteAllProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.deleteAllProduct(req.params.cid)
            if (!cart){
                throw new CustomError('cart not found', STATUS_CODES.NOT_FOUND, 'The cart does not exist, enter a valid one')
            } else {
                res.status(200).json({ status: 'success', message: 'cart empty successfully' })
            }        
        } catch (error) {
            errorHandler(error, req, res)
        }
    }

    async purchaseCart(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let {email, cart} = req.user
            if (cart !== req.params.cid){
                throw new CustomError("It's not your cart", STATUS_CODES.ERROR_AUTORIZACION, 'You can only make purchases from your cart')
            }

            let productsToCart = await cartService.getProductsToCart(req.params.cid)
            if (productsToCart.length == 0){
                throw new CustomError("You have no items in your cart", STATUS_CODES.ERROR_DATOS_ENVIADOS, 'You must have at least one item in your cart.')
            }

            let productInCart, quantity, productInStore, updateProduct, ticket
            let amount = 0
            let newProductCart = []
            for (let i = 0; i < productsToCart.length; i++) {
                productInCart = productsToCart[i].product._id
                quantity = productsToCart[i].quantity
                productInStore = await productService.getProductById(productInCart)
                if (productInStore){
                    if (productInStore.stock >= quantity){
                        amount += productInStore.price * quantity
                        productInStore.stock -= quantity
                        updateProduct = await productService.updateProduct(productInCart, {stock: productInStore.stock})
                    } else {
                        newProductCart.push({product: productInCart, quantity})
                    }
                }
            }

            req.logger.debug(newProductCart)
            if(amount > 0){
                ticket = await ticketService.createTicket({amount, purchaser:email})
                let updateCart = await cartService.updateAllProducts(req.params.cid, newProductCart)
                res.status(200).json({ status: 'success', message: 'Purchase completed!', ticket, productsWithInsufficientStock: newProductCart})
            } else {
                throw new CustomError("You have no items in your cart", STATUS_CODES.ERROR_DATOS_ENVIADOS, 'You must have at least one item in your cart.')
            }
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
}