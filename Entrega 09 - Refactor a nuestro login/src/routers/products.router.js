import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import __dirname from '../utils.js'
import { io } from '../app.js'
import mongoose from "mongoose";

const router = Router()
let productManager = new ProductManager()

router.get('/', async (req, res)=>{
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

        const products = await productManager.getProducts(limit, page, sortOption, query)
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
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.get('/:idProduct', async (req, res)=>{
    try {
        let idProduct = req.params.idProduct
        if(!mongoose.Types.ObjectId.isValid(idProduct)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }
        let product = await productManager.getProductById(idProduct)
        res.setHeader('Content-Type','application/json');
        if (product.hasOwnProperty('error')){
            res.status(404).json({ status: 'error', error: 'product not found' });
        } else {
            res.status(200).json(product);
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.post('/', async (req, res)=>{
    try {
        let newProduct = req.body
        let result = await productManager.addProduct(newProduct)
        res.setHeader('Content-Type','application/json')
        if (result.hasOwnProperty('error')){
            res.status(400).json({status: 'error', result})
        } else {
            // const products = await productManager.getProducts()
            io.emit('newProduct', result)            
            res.status(200).json({ status: 'success', message: 'product added successfully' })
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }   
})

router.put('/:idProduct', async (req, res)=>{
    try {
        let idProduct = req.params.idProduct
        let updateProduct = req.body
        let result = await productManager.updateProduct(idProduct, updateProduct)
        res.setHeader('Content-Type','application/json');
        if (result.hasOwnProperty('error')){
            res.status(400).json( {status: 'error', result} );
        } else {
            res.status(200).json( {status: 'success', message: 'product successfully updated'} );
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }  
})

router.delete('/:idProduct', async (req, res)=>{
    try {
        let idProduct = req.params.idProduct
        if(!mongoose.Types.ObjectId.isValid(idProduct)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id válido...!!!`})
        }
        const result = await productManager.deleteProduct(idProduct)
        res.setHeader('Content-Type','application/json');
        if (Object.entries(result).length === 0){
            res.status(404).json({ status: 'error', error: 'product not found' })
        } else {
            const products = await productManager.getProducts()
            console.log(result)
            io.emit('deleteProduct', result)
            res.status(200).json({ status: 'success', message: 'product successfully removed' })
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    } 
})

export default router