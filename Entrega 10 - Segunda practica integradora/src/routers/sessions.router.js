import { Router } from 'express'
import { generateToken } from '../utils.js'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('login',{session:false, failureRedirect:'/login?error=credenciales incorrectas'}), async(req, res)=>{    
    let token=generateToken(req.user)
    res.cookie('coderCookie', token, {httpOnly:true, maxAge: 1000*60*60})
    return res.redirect('/products')
})

router.post('/signup', passport.authenticate('signup',{failureRedirect:'/signup?error=error al registrar, reintente nuevamente'}), async(req, res)=>{    
    return res.redirect(`/login?mensaje=Usuario ${req.user.email} registrado correctamente`)
})

router.get('/logout',(req,res)=>{    
    res.clearCookie('coderCookie')
    return res.redirect('/login')
})

router.get('/github', passport.authenticate('github',{session:false}), (req,res)=>{})

router.get('/callbackGithub', passport.authenticate('github',{session:false, failureRedirect:"/api/sessions/errorGithub"}), (req,res)=>{
    let token=generateToken(req.user)
    res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})
    return res.redirect('/products')
})

router.get('/errorGithub',(req,res)=>{
    return res.redirect(`/login?error=error al autenticar con GitHub`)
})

router.get('/current', passport.authenticate('current',{session:false, failureRedirect:'/login?error=credenciales incorrectas'}), async(req, res)=>{    
    console.log(req.user)
    res.status(200).json({status:"OK", current: req.user})
})


export default router