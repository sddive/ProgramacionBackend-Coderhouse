import { cartModel } from "../models/cart.model.js";

export default class Cart{

    async create(){
        try {
            const cart = await cartModel.create({})
            return cart     
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async get(){
        try {
            return await cartModel.find().lean()
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getById(id){
        try {
            let cart = await cartModel.findOne({deleted:false, _id:id})
            if (cart){
                return cart
            } else {
                return null
            }                
        } catch (error) {
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

    async updateProduct(idCart, idProduct, newQuantity){
        try {
            const cart = await cartModel.findOne({deleted:false, _id:idCart})
            if (!cart){
                return
            }
            const product = await cartModel.findOne({deleted:false, _id:idCart, "products.product": idProduct})
            let updateCart
            if (!product){
                return
            } else {
                updateCart = await cartModel.findOneAndUpdate({deleted:false, _id:idCart, "products.product": idProduct}, {$set: {"products.$.quantity": newQuantity}}, {new:true})
            }
            return updateCart
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

    async updateAllProducts(idCart, newProducts){
        try {
            const cart = await cartModel.findOne({deleted:false, _id:idCart})
            if (!cart){
                return
            }
            const result = await cartModel.findOneAndUpdate(
                { _id: idCart },
                { products: newProducts},
                { new: true }
                )

            if (result.modifiedCount > 0){
                return {}
            } else {
                return {error: 'Error in update cart'} 
            }
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }    

    async deleteProduct(idCart, idProduct){
        try {
            const cart = await cartModel.findOne({deleted:false, _id:idCart})
            if (!cart){
                return
            }
            const product = await cartModel.findOne({deleted:false, _id:idCart, "products.product": idProduct})
            let result
            if (!product){
                return {error: 'Error in delete'}
            } else {
                result = await cartModel.updateOne({deleted:false, _id:idCart}, {$pull: {"products": {"product": idProduct} }})
            }
            if (result.modifiedCount > 0){
                return {}
            } else {
                return {error: 'Error in delete'} 
            }
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

    async deleteAllProduct(idCart){
        try {
            const cart = await cartModel.findOne({deleted:false, _id:idCart})
            if (!cart){
                return
            }
            const result = await cartModel.updateOne({deleted:false, _id:idCart}, {products: [] })
            if (result.modifiedCount > 0){
                return {}
            } else {
                return {error: 'Error in delete'} 
            }
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

}