import { productService } from "../services/product.services.js";
import { io } from '../app.js'
import { errorHandler } from "../middleware/errorHandler.js";
import { STATUS_CODES } from "../utils/codeError.js";
import { errorArgumentos } from "../utils/errors.js";
import { CustomError } from "../utils/customError.js";

export default class ProductController {

    async getProducts(req, res){
        try {
            const {limit, page = 1, sort, category, status} = req.query
            let sortOption = {}
            if (sort === 'asc' || sort === 'ASC'){
                sortOption = {price: 1};
              } else if (sort === 'desc' || sort === 'DESC') {
                sortOption = {price: -1}
            }
            let query = {}
            if (category) {
                query.category = { $regex: category, $options: 'i' }
            }      
            if (status !== undefined) {
                query.status = status === 'true';
            }
    
            const products = await productService.getProducts(limit, page, sortOption, query)
            const {totalPages, prevPage, nextPage, hasPrevPage, hasNextPage} = products
            let prevLink = ''
            let nextLink = ''
            if (hasPrevPage) {
                prevLink = `localhost:8080/api/products?limit=${limit}&page=${prevPage}`
            } else { 
                prevLink = null
            }
            if (hasNextPage) {
                nextLink = `localhost:8080/api/products?limit=${limit}&page=${nextPage}`
            } else {
                 nextLink = null
            }
            res.setHeader('Content-Type','application/json')
            res.status(200).json({
                status: 'success', payload: products.docs,
                totalPages, prevPage, nextPage, page: parseInt(page), hasPrevPage, hasNextPage, prevLink, nextLink
            })
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async getProductById(req, res){
        try {
            let idProduct = req.params.idProduct
            if(!mongoose.Types.ObjectId.isValid(idProduct)){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`Ingrese un id válido...!!!`})
            }
            let product = await productService.getProductById(idProduct)
            res.setHeader('Content-Type','application/json');
            if (product.hasOwnProperty('error')){
                throw new CustomError('product not found', STATUS_CODES.NOT_FOUND, 'The product does not exist, enter a valid one')
            } else {
                res.status(200).json(product);
            } 
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    
    async addProduct(req, res){
        try {
            let newProduct = req.body
            const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category', 'status']
            const validFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category', 'status', 'deleted']

            for (const field of requiredFields) {
                if (!newProduct[field]) {
                    throw new CustomError(`the field ${field} is required`, STATUS_CODES.ERROR_ARGUMENTOS, errorArgumentos(newProduct))
                }
            }

            const fieldsNewProduct = Object.keys(newProduct)
            const validFieldsNewProduct = fieldsNewProduct.every(key => validFields.includes(key));
            if (!validFieldsNewProduct) {
                throw new CustomError(`the field ${fieldNew} is not valid`, STATUS_CODES.ERROR_ARGUMENTOS, errorArgumentos(newProduct))
            }

            let result = await productService.addProduct(newProduct)
            res.setHeader('Content-Type','application/json')
            if (result.hasOwnProperty('error')){
                throw new CustomError('error in product arguments', STATUS_CODES.ERROR_ARGUMENTOS, 'Review the arguments sent to create the product.')
            } else {
                io.emit('newProduct', result)            
                res.status(200).json({ status: 'success', message: 'product added successfully' })
            } 
        } catch (error) {
            errorHandler(error, req, res)
        }   
    }
    
    async updateProduct(req, res){
        try {
            let idProduct = req.params.idProduct
            let updateProduct = req.body
            let result = await productService.updateProduct(idProduct, updateProduct)
            res.setHeader('Content-Type','application/json');
            if (result.hasOwnProperty('error')){
                throw new CustomError('error in product arguments', STATUS_CODES.ERROR_ARGUMENTOS, 'Review the arguments sent to create the product.')
            } else {
                res.status(200).json( {status: 'success', message: 'product successfully updated'} );
            } 
        } catch (error) {
            errorHandler(error, req, res)
        }  
    }
    
    async delete(req, res){
        try {
            let idProduct = req.params.idProduct
            if(!mongoose.Types.ObjectId.isValid(idProduct)){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`Ingrese un id válido...!!!`})
            }
            const result = await productService.deleteProduct(idProduct)
            res.setHeader('Content-Type','application/json');
            if (Object.entries(result).length === 0){
                throw new CustomError('product not found', STATUS_CODES.NOT_FOUND, 'The product does not exist, enter a valid one')
            } else {
                const products = await productService.getProducts()
                console.log(result)
                io.emit('deleteProduct', result)
                res.status(200).json({ status: 'success', message: 'product successfully removed' })
            } 
        } catch (error) {
            errorHandler(error, req, res)
        } 
    }
}