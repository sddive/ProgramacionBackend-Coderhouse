import Product from "../dao/classes/product.dao.js";

class ProductService {
    
    constructor(){
        this.productDAO = new Product()
    }

    async getProducts(limit, page, sort, query){
        try {
            return await this.productDAO.get(limit, page, sort, query)
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getProductById(id){
        try {
            return await this.productDAO.getById(id)
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async addProduct(newProduct){
        try {
            return await this.productDAO.create(newProduct)     
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async updateProduct(id, object){
        try {
            return await this.productDAO.update(id, object)
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async deleteProduct(id){
        try {
            return await this.productDAO.delete(id)
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}

export const productService = new ProductService()