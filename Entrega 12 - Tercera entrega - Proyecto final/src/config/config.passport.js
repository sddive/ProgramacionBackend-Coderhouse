import passport from 'passport'
import local from 'passport-local'
import passportJWT from 'passport-jwt'
import github from 'passport-github2'
import { userModel } from '../dao/models/user.model.js'
import { cartModel } from '../dao/models/cart.model.js'
import { createHash, validPassword } from '../utils.js'
import { config } from './config.dotenv.js'
import mongoose from "mongoose"


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
                delete user.password
                return done(null, user)
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
                    return done(null, false)
                }
            
                let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                console.log(regMail.test(email))
                if(!regMail.test(email)){
                    return done(null, false)
                }
            
                let existe = await userModel.findOne({email})
                if(existe){
                    return done(null, false)
                }

                password = createHash(password)
                let user
                try {
                    let cart = await cartModel.create({})
                    user = await userModel.create({first_name, last_name, email, password, cart:cart._id})
                    // res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
                    return done(null, user)
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
                    console.log('entre al admin')
                    user = {_id: new mongoose.Types.ObjectId(), first_name:'Admin', last_name:'Coder',  email:'adminCoder@coder.com', role: 'admin'}
                    return done(null, user)
                }

                user = await userModel.findOne({email:username}).lean()
                if(!user){
                    return done(null, false)
                }
                if(!validPassword(user, password)){
                    return done(null, false)
                }     

                //console.log(Object.keys(user))
                delete user.password
                return done(null, user)
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
                let usuario=await userModel.findOne({email: profile._json.email}).lean()
                if(!usuario){

                    let cart = await cartModel.create({})
                    let newUser={
                        first_name: profile._json.name,
                        email: profile._json.email, 
                        cart: cart._id,
                        profile
                    }

                    usuario=await userModel.create(newUser)
                }
                return done(null, usuario)

            } catch (error) {
                return done(error)
            }
        }
    ))

}