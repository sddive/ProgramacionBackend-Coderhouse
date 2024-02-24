import { productModel } from "../models/product.model.js";

export default class Product{

    async get(limit=10, page=1, sort={}, query={}){
        try {
            return await productModel.paginate(query ,{lean: true, limit: limit, page: page, sort: sort})
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getById(id){
        try {
            return await productModel.findOne({deleted:false, _id:id}) 
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async create(newProduct){
        try {
            const productByCode = await productModel.findOne({deleted:false, code: newProduct.code})
            if(productByCode){
                console.log('The code already exists')
                return {error: 'The code already exists'}
            }
            let product = await productModel.create(newProduct)
            return product     
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async update(id, object){
        try {
            const product = await productModel.findOne({deleted:false, _id: id})
            if(!product){
                console.log('Product does not exist')
                return { error: 'Product not found' }
            }
            const productsByCode = await productModel.find({deleted:false, code: object.code})
            if (productsByCode.length > 1){
                console.log('The code already exists')
                return {error: 'The code already exists'}    
            }     
            const result = await productModel.updateOne({deleted:false, _id:id}, object)
            if (result.modifiedCount > 0){
                return {}
            } else {
                return {error: 'Error in update'} 
            }
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async delete(id){
        try {
            const product = await productModel.findOne({deleted:false, _id: id})
            if(!product){
                console.log('Product does not exist')
                return { error: 'Product not found' }
            }
            const result = await productModel.updateOne({_id:id},{deleted:true}) 
            if (result.modifiedCount > 0){
                return {}
            } else {
                return {error: 'Error in delete'} 
            }
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}
