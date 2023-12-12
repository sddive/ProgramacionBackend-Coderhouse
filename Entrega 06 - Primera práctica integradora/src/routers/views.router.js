import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import __dirname from '../utils.js'
import { io } from '../app.js'

const router = Router()
const productManager = new ProductManager()


router.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    const title = 'Tienda online'
    if(products){
        console.log(products)
        res.status(200).render('home', {title, products})
    }
})

router.get('/realtimeproducts', async (req, res)=>{
    const title = 'Tienda online - En tiempo real'      
    res.status(200).render('realtimeproducts', {title})
})

router.get('/chat', async (req, res)=>{
    const title = 'Tienda online - Chat'      
    res.status(200).render('chat', {title})
})


export default router