import { Router } from 'express'
import ProductManager from '../classes/ProductManager.js'
import __dirname from '../utils.js'

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
        if(isNaN(idProduct)){
            return res.send('Error, the id is not numeric')
        }
        let product = await productManager.getProductById(parseInt(idProduct))
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
            res.status(200).json({ status: 'success', message: 'product added successfully' })
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }   
})

router.put('/:idProduct', async (req, res)=>{
    try {
        let idProduct = req.params.idProduct
        if(isNaN(idProduct)){
            return res.status(400).json({ status: 'error', error: 'the id is not numeric'})
        }
        let updateProduct = req.body
        let result = await productManager.updateProduct(parseInt(idProduct), updateProduct)
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
        if(isNaN(idProduct)){
            return res.status(400).send( {status: 'error', error: 'the id is not numeric'})
        }
        const result = await productManager.deleteProduct(parseInt(idProduct))
        res.setHeader('Content-Type','application/json');
        if (Object.entries(result).length === 0){
            res.status(404).json({ status: 'error', error: 'product not found' })
        } else {
            res.status(200).json({ status: 'success', message: 'product successfully removed' })
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    } 
})

export default router