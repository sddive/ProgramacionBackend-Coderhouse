import passport from 'passport'
import local from 'passport-local'
import passportJWT from 'passport-jwt'
import github from 'passport-github2'
import { createHash, validPassword } from '../utils.js'
import { config } from './config.dotenv.js'
import mongoose from "mongoose"
import UserDTO from '../dto/user.dto.js'
import User from '../dao/classes/user.dao.js'
import { cartService } from '../services/cart.services.js'
const userDAO = new User()

const searchToken=(req)=>{
    let token=null

    if(req.cookies.coderCookie){
        token=req.cookies.coderCookie
    }
    return token
}

export const initPassport=()=>{

    passport.use('current', new passportJWT.Strategy(
        {
            secretOrKey: config.SECRET_KEY,
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([searchToken])
        },
        async (user, done)=>{
            try {
                let userDTO = new UserDTO(user)
                return done(null, userDTO)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('signup', new local.Strategy(
        {
            passReqToCallback: true, 
            usernameField: 'email' //, passwordField: "clave"
        },
        async(req, username, password, done)=>{
            try {
                let {first_name, last_name, email} = req.body
                if(!first_name || !last_name || !email || !password){
                    req.logger.http('Faltan datos para registrar al usuario')
                    return done(null, false)
                }
            
                let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                req.logger.debug(regMail.test(email))
                if(!regMail.test(email)){
                    return done(null, false)
                }
            
                let existe = await userDAO.getByEmail(email)
                if(existe){
                    return done(null, false)
                }

                password = createHash(password)
                let user
                try {
                    let cart = await cartService.addCart()
                    req.logger.debug(JSON.stringify(cart))
                    user = await userDAO.create({first_name, last_name, email, password, cart:cart._id})
                    req.logger.debug(JSON.stringify(user))
                    // res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
                    let userDTO = new UserDTO(user)
                    return done(null, userDTO)
                    // previo a devolver un usuario con done, passport graba en la req, una propiedad
                    // user, con los datos del usuario. Luego podré hacer req.user
                } catch (error) {
                    // res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
                    return done(null, false)
                }
                   
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async(username, password, done)=>{
            try {
                if(!username || !password){
                    return done(null, false)
                }
                let user
                if(username === 'adminCoder@coder.com' && password === 'adminCod3r123'){
                    req.logger.debug('Inicie sesión con usuario admin.')
                    user = {_id: new mongoose.Types.ObjectId(), first_name:'Admin', last_name:'Coder',  email:'adminCoder@coder.com', role: 'admin'}
                    let userDTO = new UserDTO(user)
                    return done(null, userDTO)
                }

                user = await userDAO.getByEmail(username)
                if(!user){
                    req.logger.http(`No existe usuario con el email ${username}`)
                    return done(null, false)
                }
                if(!validPassword(user, password)){
                    return done(null, false)
                }     

                let userDTO = new UserDTO(user)
                return done(null, userDTO)
                    // previo a devolver un usuario con done, passport graba en la req, una propiedad
                    // user, con los datos del usuario. Luego podré hacer req.user

            } catch (error) {
                done(error, null)
            }
        }
    ))    


    passport.use('github', new github.Strategy(
        {
            clientID: config.clientID, 
            clientSecret: config.clientSecret, 
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub", 
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                let user = await userDAO.getByEmail(profile._json.email)
                if(!user){

                    let cart = await cartService.addCart()
                    let newUser={
                        first_name: profile._json.name,
                        email: profile._json.email, 
                        cart: cart._id,
                        profile
                    }

                    user = await userDAO.create(newUser)
                }
                let userDTO = new UserDTO(user)
                return done(null, userDTO)

            } catch (error) {
                return done(error)
            }
        }
    ))

}