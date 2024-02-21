import {cartService} from "../services/cart.services.js";

export default class CartController {

    async addCart(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let cart = await cartService.addCart()
            if (Object.entries(cart).length === 0){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', error: `cart ${cart.id} created` })
            } 
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }  
    }
    
    async getProductsToCart(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            let idCart = req.params.cid
            let productsToCart = await cartService.getProductsToCart(idCart)
            if (!productsToCart){
                res.status(404).json({ status: 'error',  error: 'cart not found' })
            } else {
                res.status(200).json({products: productsToCart})
            }        
        } catch (error) {
            res.status(500).json({ status: 'errorCONTR', error: error.message })
        }
    }
    
    async addProduct (req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.addProduct(req.params.cid, req.params.pid)
            if (!cart){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', message: 'product added to cart successfully' })
            }        
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
    
    async updateProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.updateProduct(req.params.cid, req.params.pid, parseInt(req.body.quantity))
            if (!cart){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', message: 'quantity updated successfully' })
            }        
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
    
    async updateAllProducts(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.updateAllProducts(req.params.cid, req.body.products)
            if (!cart){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', message: 'cart update successfully' })
            }        
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
    
    async deleteProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.deleteProduct(req.params.cid, req.params.pid)
            if (!cart){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', message: 'product deleted to cart successfully' })
            }        
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
    
    async deleteAllProduct(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const cart = await cartService.deleteAllProduct(req.params.cid)
            if (!cart){
                res.status(404).json({ status: 'error', error: 'cart not found' })
            } else {
                res.status(200).json({ status: 'success', message: 'cart empty successfully' })
            }        
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message })
        }
    }
}