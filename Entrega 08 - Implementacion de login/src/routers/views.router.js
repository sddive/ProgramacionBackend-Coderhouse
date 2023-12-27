import { Router } from 'express'
import ProductManager from '../dao/ProductManagerBD.js'
import CartManager from '../dao/CartManagerBD.js'
import __dirname from '../utils.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()


const auth = (req, res, next)=>{
    if(!req.session.user){
        res.redirect('/login')
    }
    next()
}

router.get('/', async (req, res)=>{
    const products = await productManager.getProducts()
    const title = 'Tienda online'
    if(products){
        res.status(200).render('home', {title})
    }
})

router.get('/realtimeproducts', (req, res)=>{
    const title = 'Tienda online - En tiempo real'      
    res.status(200).render('realtimeproducts', {title})
})

router.get('/chat', (req, res)=>{
    const title = 'Tienda online - Chat'      
    res.status(200).render('chat', {title})
})

router.get('/carts/:cid', async (req, res)=>{
    try {
        const products = await cartManager.getProductsToCart(req.params.cid)
        const title = 'Carrito'      
        res.status(200).render('cart', {title, products})
    } catch (error){
        res.status(500).json({ status: 'error', error: error.message })
    }    
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

router.get('/login', (req, res)=>{
    const title = 'Login'   
    let {error, mensaje} = req.query   
    res.status(200).render('login', {title, error, mensaje})    
})

router.get('/signup', (req, res)=>{
    const title = 'Registro'      
    error
    res.status(200).render('signup', {title})
})

router.get('/profile', auth, (req, res)=>{
    const title = 'Perfil'  
    let user = req.session.user    
    res.status(200).render('profile', {title, user})
})

router.get('/logout',(req,res)=>{
    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
        }
    })
})

export default router