import * as fs from 'fs';
import ProductManager from './CartManagerBD.js'
import __dirname from '../utils.js'
import { cartModel } from "./models/cart.model.js";

export default class CartManager{

    constructor(path){
        this.path = path
    }

    async getProductsToCart(id){
        try {
            const cart = await cartModel.findOne({deleted:false, _id:id})
            const products = cart.products
            return products
        } catch (error) {
            throw new Error(error.message)        
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
        try {
            const cart = await cartModel.findOne({deleted:false, _id:idCart})
            if (!cart){
                return
            }
            const product = await cartModel.findOne({deleted:false, _id:idCart, "products.product": idProduct})
            let updateCart
            if (!product){
                const newProduct = {product: idProduct, quantity: 1}
                updateCart = await cartModel.findOneAndUpdate({deleted:false, _id:idCart}, {$push: {products: newProduct}}, {new:true})
            } else {
                const quantity = await cartModel.findOne({deleted:false, _id:idCart, "products.product": idProduct}, 'products.$').lean()
                let newQuantity = quantity.products[0].quantity + 1
                updateCart = await cartModel.findOneAndUpdate({deleted:false, _id:idCart, "products.product": idProduct}, {$set: {"products.$.quantity": newQuantity}}, {new:true})
            }
            return updateCart
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }
}