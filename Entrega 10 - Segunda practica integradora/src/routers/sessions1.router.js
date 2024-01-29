import { MiRouter } from "./router.js"
import { generateToken, passportCall } from "../utils.js"
import passport from "passport"

export class SessionsRouter1 extends MiRouter{
    init(){
        this.post("/signup", ["PUBLIC"], passportCall("signup"), (req,res)=>{

            return res.successAlta("Registro correcto...!!!", req.user)
        })

        this.post("/login", ["PUBLIC"], passportCall("login"), (req,res)=>{

            let token=generateToken(req.user)
            res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})
            return res.success(`Login correcto para el usuario ${req.user.nombre}, con rol: ${req.user.rol}`)
        })

        this.get("/current", ["PUBLIC"], passportCall("current"), (req,res)=>{
            let current = req.user
            return res.success(current)
            res.status(200).json({status:"OK", current: req.user})
        })
    }
}
/*
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
    res.status(200).json({status:"OK", current: req.user})
})


export default router*/