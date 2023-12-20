import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import __dirname from './utils.js'
import ProductManager from './dao/ProductManagerBD.js'
import MessageManager from './dao/MessageManagerBD.js'
import mongoose from 'mongoose'

const PORT = 8080
const app = express()
const server = app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})

let productManager = new ProductManager()
let messageManager = new MessageManager()
let users = []

export const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)

io.on('connection', socket=>{
    console.log('cliente conectado')

    socket.on('getProducts', async ()=>{
        const limit = Number.MAX_SAFE_INTEGER
        const products = await productManager.getProducts(limit)
        socket.emit('allProducts', products.docs)
    })
    
    socket.on('id', async nombre=>{
        try {
            users.push({nombre, id:socket.id})
            socket.broadcast.emit('newUser',nombre)
            let messages = await messageManager.getMessages()
            socket.emit("allMessages" ,messages)
        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on('message', async datos=>{
        try{
            let messages = await messageManager.addMessage(datos)
            io.emit('newMessage', datos)
        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on("disconnect",()=>{
        let user = users.find(u=>u.id===socket.id)
        if(user){
            io.emit("userDisconnect", user.nombre)
        }
    })
})

try {
    await mongoose.connect('mongodb+srv://sergiodivenutoq:Coder23.@codersdivenuto.mlve65q.mongodb.net/?retryWrites=true&w=majority', {dbname:'ecommerce'})
    console.log('DB Online...!!!')
} catch (error) {
    console.log(error)
}
