import { Router } from 'express'
import __dirname from '../utils.js'
import { userModel } from "../dao/models/user.model.js"
import { createHash, validPassword } from '../utils.js';
import passport from 'passport'

const router = Router()

router.post('/login', async(req, res)=>{

    let {email, password} = req.body
    if(!email || !password){
        return res.redirect('/login?error=Complete todos los datos')
    }

    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
        req.session.user = {
            name:'Admin coder', email:'adminCoder@coder.com', role: 'admin'
        }
        return res.redirect('/products')
    }

    let user = await userModel.findOne({email})
    if(!user){
        return res.redirect(`/login?error=credenciales incorrectas`)
    }
    if(!validPassword(user, password)){
        return res.redirect(`/login?error=credenciales incorrectas`)
    }
    
    req.session.user = {
        name:user.name, email:user.email, role:user.role
    }

    res.redirect('/products')

})

router.post('/sigup',async(req,res)=>{

    let {name, email, password}=req.body
    if(!name || !email || !password){
        return res.redirect('/signup?error=Complete todos los datos')
    }

    let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    console.log(regMail.test(email))
    if(!regMail.test(email)){
        return res.redirect('/signup?error=Mail con formato incorrecto...!!!')
    }

    let existe = await userModel.findOne({email})
    if(existe){
        return res.redirect(`/signup?error=Existen usuarios con email ${email} en la BD`)
    }
    
    password = createHash(password)
    try {
        const user = await userModel.create({name, email, password})
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
        
    } catch (error) {
        res.redirect('/signup?error=Error inesperado. Reintente en unos minutos')
    }

})

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })

    res.redirect('/login')

})

router.get('/github', passport.authenticate('github',{}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    req.session.user=req.user
    res.redirect('/products')
})

router.get('/errorGithub',(req,res)=>{
    return res.redirect(`/login?error=error al autenticar con GitHub`)
})


export default router