import { Router } from 'express'
import __dirname from '../utils.js'
import { userModel } from "../dao/models/user.model.js"
import crypto from 'crypto'

const router = Router()

router.post('/login', async(req, res)=>{

    let {email, password} = req.body
    if(!email || !password){
        return res.redirect('/login?error=Complete todos los datos')
    }

    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")

    let user = await userModel.findOne({email, password})
    if(!user){
        return res.redirect(`/login?error=credenciales incorrectas`)
    }
    
    req.session.user = {
        name:user.name, email:user.email, role:user.role
    }

    res.redirect('/profile')

})

router.post('/sigup',async(req,res)=>{

    let {name, email, password}=req.body
    if(!name || !email || !password){
        return res.redirect('/registro?error=Complete todos los datos')
    }

    let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
    console.log(regMail.test(email))
    if(!regMail.test(email)){
        return res.redirect('/registro?error=Mail con formato incorrecto...!!!')
    }

    let existe = await userModel.findOne({email})
    if(existe){
        return res.redirect(`/registro?error=Existen usuarios con email ${email} en la BD`)
    }
    
    password = crypto.createHmac("sha256", "codercoder123").update(password).digest("hex")
    try {
        const user = await userModel.create({name, email, password})
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
        
    } catch (error) {
        res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
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

export default router