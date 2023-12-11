import { Router } from 'express'
import CartManager from '../dao/CartManagerBD.js'
import __dirname from '../utils.js'

const router = Router()
let cartManager = new CartManager(__dirname + "/files/carrito.json")

router.post('/', async (req, res)=>{
    res.setHeader('Content-Type','application/json')
    try {
        let cart = await cartManager.addCart()
        if (Object.entries(cart).length === 0){
            res.status(404).json({ status: 'error', error: 'cart not found' })
        } else {
            res.status(200).json({ status: 'success', error: `cart ${cart.id} created` })
        } 
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }  
})

router.get('/:cid', async (req, res)=>{
    res.setHeader('Content-Type','application/json')
    try {
        let idCart = req.params.cid
        console.log(idCart)
        let productsToCart = await cartManager.getProductsToCart(idCart)
        if (!productsToCart){
            res.status(404).json({ status: 'error',  error: 'cart not found' })
        } else {
            res.status(200).json({products: productsToCart})
        }        
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

router.post('/:cid/product/:pid', async (req, res)=>{
    res.setHeader('Content-Type','application/json')
    try {
        const cart = await cartManager.addProduct(req.params.cid, req.params.pid)
        if (!cart){
            res.status(404).json({ status: 'error', error: 'cart not found' })
        } else {
            res.status(200).json({ status: 'success', message: 'product added to cart successfully' })
        }        
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message })
    }
})

export default router