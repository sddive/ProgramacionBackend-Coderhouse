import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import mocksRouter from './routers/mocks.router.js'
import sessionsRouter from './routers/sessions.router.js';
import __dirname from './utils.js'
import mongoose from 'mongoose'
import { initPassport } from './config/config.passport.js';
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { config } from './config/config.dotenv.js'
import { productService } from './services/product.services.js'
import { messageService } from './services/message.service.js'
//import { errorHandler } from './middlewares/errorHandler.js'


const PORT = config.PORT
const app = express()
const server = app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})

export const io = new Server(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))


initPassport()
app.use(passport.initialize())
app.use(cookieParser())

app.use('/api/sessions/', sessionsRouter)
app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/mockingproducts', mocksRouter)
app.use('/', viewsRouter)

//app.use(errorHandler)

let users = []

io.on('connection', socket=>{
    console.log('cliente conectado')

    socket.on('getProducts', async ()=>{
        const limit = Number.MAX_SAFE_INTEGER
        const products = await productService.getProducts(limit)
        socket.emit('allProducts', products.docs)
    })
    
    socket.on('id', async nombre=>{
        try {
            users.push({nombre, id:socket.id})
            socket.broadcast.emit('newUser',nombre)
            let messages = await messageService.getMessages()
            socket.emit("allMessages" ,messages)
        } catch (error) {
            console.log(error.message)
        }
    })

    socket.on('message', async datos=>{
        try{
            let messages = await messageService.addMessage(datos)
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
    await mongoose.connect(config.mongo_URL, {dbname:config.dbName})
    console.log('DB Online...!!!')
} catch (error) {
    console.log(error)
}