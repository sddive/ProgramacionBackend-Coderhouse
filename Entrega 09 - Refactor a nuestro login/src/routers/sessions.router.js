import { Router } from 'express'
import __dirname from '../utils.js'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('login',{failureRedirect:'/login?error=credenciales incorrectas'}), async(req, res)=>{    
    req.session.user = {
        name:req.user.name, email:req.user.email, role:req.user.role
    }

    res.redirect('/products')
})

router.post('/signup', passport.authenticate('signup',{failureRedirect:'/signup?error=error al registrar, reintente nuevamente'}), async(req, res)=>{    
    req.session.user = {
        name:req.user.name, email:req.user.email, role:req.user.role
    }
    res.redirect(`/login?mensaje=Usuario ${req.user.email} registrado correctamente`)
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