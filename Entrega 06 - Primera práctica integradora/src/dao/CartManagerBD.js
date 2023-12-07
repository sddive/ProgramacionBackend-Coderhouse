import * as fs from 'fs';
import ProductManager from './CartManagerBD.js'
import __dirname from '../utils.js'
import { cartModel } from "./models/cart.model.js";

export default class CartManager{

    constructor(path){
        this.path = path
    }

    async getCarts(){
        // try {
        //     if (fs.existsSync(this.path)){
        //         return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        //     } else {
        //         return []
        //     }
        // } catch (error) {
        //     throw new Error('Error: ' + error.message)        
        // }
    }

    async getProductsToCart(id){
        try {
        const cart = await cartModel.findOne({deleted:false, _id:id})
        const products = cart.products
        console.log(products)
        //     let cartById = carts.find(cart=>cart.id===id)
        //     if(!cartById){
        //         return 
        //     }
        //     return cartById.products
        } catch (error) {
            throw new Error('Error: ' + error.message)        
        }
    }

    async addCart(){
        try {
            const cart = await cartModel.create({})
            return cart     
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async addProduct(idCart, idProduct){
        // try {
        //     let carts = await this.getCarts()
        //     let cartById = carts.find(cart=>cart.id===idCart)
        //     if(!cartById){
        //         return {}
        //     }
        //     let productManager = new ProductManager(__dirname + "/files/productos.json")
        //     let productById = await productManager.getProductById(idProduct)
        //     if(!productById){
        //         throw new Error('Product not found')  
        //     } else {
        //         let productsInCart = cartById.products
        //         let index = productsInCart.findIndex(p=>p.product == idProduct)
        //         if (index === -1){
        //             let newProduct = {
        //                 product: idProduct, 
        //                 quantity: 1
        //             }
        //             productsInCart.push(newProduct)
        //         } else {
        //             productsInCart[index].quantity += 1
        //         }
        //         await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        //         return productsInCart
        //     }
        // } catch (error) {
        //     throw new Error('Error: ' + error.message)        
        // }
    }
}