import { cartService } from "../services/cart.services.js"
import { productService } from "../services/product.services.js"
import { decodeToken } from '../utils.js'
import { errorHandler } from "../middleware/errorHandler.js"

export default class ViewController {

    home(req, res){
        const title = 'Tienda online'
        res.status(200).render('home', {title})
    }
    
    realtimeproducts(req, res){
        const title = 'Tienda online - En tiempo real'      
        res.status(200).render('realtimeproducts', {title})
    }
    
    chat(req, res){
        const title = 'Tienda online - Chat'      
        res.status(200).render('chat', {title})
    }
    
    async cart(req, res){
        try {
            const products = await cartService.getProductsToCart(req.params.cid)
            const title = 'Carrito'      
            res.status(200).render('cart', {title, products})
        } catch (error){
            errorHandler(error, req, res)
        }    
    }
    
    async products(req, res){
        let user = {}
        if(req.cookies.coderCookie){
            user = decodeToken(req.cookies.coderCookie)
        }
    
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
        const title = 'Productos'      
        res.status(200).render('products', {title, user, products})
    }
    
    login(req, res){
        if (req.cookies.coderCookie){
            return res.redirect('/products')
        }
        const title = 'Login'   
        let {error, mensaje} = req.query   
        res.status(200).render('login', {title, error, mensaje})    
    }
    
    signup(req, res){
        const title = 'Registro'      
        let {error} = req.query
        res.status(200).render('signup', {error, title})
    }
    
    logout(req,res){
        req.session.destroy(error=>{
            if(error){
                res.setHeader('Content-Type','application/json');
                return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
            }
        })
        res.redirect('/login')
    }

    resetPassword01(req, res){
        const title = 'Restaurar contraseña'   
        let {error, message} = req.query   
        res.status(200).render('resetPassword01', {title, error, message})    
    }

    resetPassword02(req, res){
        const title = 'Restaurar contraseña'   
        let {error, message} = req.query
        console.log(error)
        res.status(200).render('resetPassword02', {title, error, message})    
    }
}