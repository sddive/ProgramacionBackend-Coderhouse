import express from 'express'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)

app.get('/', (req, res)=>{
    res.status(200).send('Server on line')
})

const server=app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})
