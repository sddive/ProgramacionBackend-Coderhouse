import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import __dirname from '../utils.js'
import { io } from '../app.js'

const router = Router()
const productManager = new ProductManager(__dirname + "/files/productos.json")


router.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    const title = 'Tienda online'
    if(products){
        res.status(200).render('home', {title, products})
    } else {

    }
})

router.get('/realtimeproducts', async (req, res)=>{
    const title = 'Tienda online - En tiempo real'      
    res.status(200).render('realtimeproducts', {title})
})


export default router