import cart from "../dao/classes/cart.dao.js";

class CartService {

    constructor(){
        this.cartDAO = new cart()
    }

    async addCart(){
        try {
            return await this.cartDAO.create()    
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async getProductsToCart(id){
        try {
            let cart = await this.cartDAO.getById(id)
            return cart.products
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async addProduct(idCart, idProduct){
        try {
            let cart = await this.cartDAO.addProduct(idCart, idProduct)
            return cart
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

    async updateProduct(idCart, idProduct, newQuantity){
        try {
            return await this.cartDAO.updateProduct(idCart, idProduct, newQuantity)
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

    async updateAllProducts(idCart, newProducts){
        try {
            return await this.cartDAO.updateAllProducts(idCart, newProducts)
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }    

    async deleteProduct(idCart, idProduct){
        try {
            return await this.cartDAO.deleteProduct(idCart, idProduct)
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }

    async deleteAllProduct(idCart){
        try {
            return await this.cartDAO.deleteAllProduct(idCart)
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)        
        }
    }    
}

export const cartService = new CartService()