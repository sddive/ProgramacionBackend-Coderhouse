import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import __dirname from './utils.js'
import ProductManager from './classes/ProductManager.js'

const PORT = 8080
const app = express()
const server = app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})

let productManager = new ProductManager(__dirname + "/files/productos.json")

export const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views', './views')
app.use(express.static(__dirname + '/public'))

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)

io.on('connection', socket=>{
    console.log('cliente conectado')
    socket.on('getProducts', async ()=>{
        const products = await productManager.getProducts()
        socket.emit('allProducts', products)
    })
})

