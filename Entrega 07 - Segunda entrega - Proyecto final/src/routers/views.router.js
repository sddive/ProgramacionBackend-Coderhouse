import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import CartManager from '../dao/CartManagerBD.js'
import __dirname from '../utils.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()


router.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    const title = 'Tienda online'
    if(products){
        res.status(200).render('home', {title})
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

router.get('/carts/:cid', async (req, res)=>{
    const products = await cartManager.getProductsToCart(req.params.cid)
    const title = 'Carrito'      
    res.status(200).render('cart', {title, products})
})

router.get('/products', async (req, res)=>{
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
    const title = 'Productos'      
    res.status(200).render('products', {title, products})
})

export default router