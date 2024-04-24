import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'
import mocksRouter from './routers/mocks.router.js'
import usersRouter from './routers/users.router.js'
import sessionsRouter from './routers/sessions.router.js'
import loggerRouter from './routers/logger.router.js'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import { initPassport } from './config/config.passport.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { config } from './config/config.dotenv.js'
import { productService } from './services/product.services.js'
import { messageService } from './services/message.service.js'
import { middLogg } from './middleware/logger.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const PORT = config.PORT
const app = express()
const server = app.listen(PORT, ()=>{
    console.log(`Server on line en puerto ${PORT}`)
})

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title: "Sergio Divenuto - Ecommerce",
            version: "1.0.0",
            description: "Ecommerce API documentation"
        }
    },
    apis: [__dirname + "/docs/*.yaml"]
}

const specs=swaggerJsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

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
app.use(middLogg)

app.use('/api/sessions/', sessionsRouter)
app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/api/users/', usersRouter)
app.use('/mockingproducts', mocksRouter)
app.use('/loggertest', loggerRouter)
app.use('/', viewsRouter)

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