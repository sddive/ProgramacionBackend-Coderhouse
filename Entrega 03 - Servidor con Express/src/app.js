import ProductManager from './ProductManager.js'
import express from 'express'

let productManager = new ProductManager("./products.json")
const PORT = 8080
const app = express()

app.get('/', (req, res)=>{
    res.send('Server on line')
})

app.get('/products', async (req, res)=>{
    try {
        let products = await productManager.getProducts()
        if(req.query.limit){
            products=products.slice(0, req.query.limit)
        }
        res.setHeader('Content-Type','application/json');
        res.status(200).json({products}); 
    } catch {
        res.status(500).send('Exception');
    }
})

app.get('/products/:idProduct', async (req, res)=>{
    try {
        let idProduct = req.params.idProduct
        if(isNaN(idProduct)){
            return res.send('Error, the id is not numeric')
        }
        let product = await productManager.getProductById(parseInt(idProduct))
        res.setHeader('Content-Type','application/json');
        if (Object.entries(product).length === 0){
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(200).json({product});
        } 
    } catch {
        res.status(404).json({ error: 'Product not found' });
    }   
})

const server=app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})
