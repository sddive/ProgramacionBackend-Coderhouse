import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import __dirname from '../utils.js'
import { io } from '../app.js'
import mongoose from "mongoose";

const router = Router()
let productManager = new ProductManager(__dirname + "/files/productos.json")

router.get('/', async (req, res)=>{
    try {
        let products = await productManager.getProducts()
        if(req.query.limit){
            products=products.slice(0, req.query.limit)
        }
        res.setHeader('Content-Type','application/json')
        res.status(200).json({products})
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