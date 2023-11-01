import ProductManager from './ProductManager.js';
import express  from 'express'

let productManager = new ProductManager("./products.json")
const PORT = 8080
const app = express()

app.get('/',(req, res)=>{
    res.send("Soy otro server, ahora desarrollado con ExpressJS...!!!")
})

app.get('/products',(req, res)=>{
    let products = productManager.getProducts()
    if(req.query.limit){
        products=products.slice(0, req.query.limit)
    }
    res.setHeader('Content-Type','application/json');
    res.status(200).json({products}); 
})

app.get('/products/:idProduct',(req, res)=>{
    let idProduct = req.params.idProduct
    if(isNaN(idProduct)){
        return res.send('Error, ingrese un argumento id numerico')
    }
    let product = productManager.getProductById(parseInt(idProduct))
    res.setHeader('Content-Type','application/json');
    res.status(200).json({product});   
})

app.get('/products',(req,res)=>{

    let resultado=starWars

    if(req.query.limit){
        resultado=resultado.slice(0, req.query.limit)
    }

    res.setHeader('Content-Type','application/json');
    res.status(200).json({filtros: req.query,resultado });
})

const server=app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})