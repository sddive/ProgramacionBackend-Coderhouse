import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { userModel } from '../dao/models/user.model.js'
import { createHash, validPassword } from '../utils.js';
import mongoose from "mongoose"

export const initPassport=()=>{
    passport.use('signup', new local.Strategy(
        {
            passReqToCallback: true, usernameField: 'email' //, passwordField: "clave"
        },
        async(req, username, password, done)=>{
            try {
                let {name, email} = req.body
                if(!name || !email || !password){
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
                    user = await userModel.create({name, email, password})
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
                    user = {_id: new mongoose.Types.ObjectId(), name:'Admin coder', email:'adminCoder@coder.com', role: 'admin'}
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
            clientID: "Iv1.196c0c1838a16816", 
            clientSecret: "548ffeb491a76899bcda4e2423c1e4f929c084d3", 
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub", 
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                // console.log(profile)
                let usuario=await userModel.findOne({email: profile._json.email})
                if(!usuario){
                    let newUser={
                        name: profile._json.name,
                        email: profile._json.email, 
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

    // serializador / deserializador
    passport.serializeUser((user, done)=>{
        return done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let user = await userModel.findById(id)
        return done(null, user)
    })

} // fin initPassport