import { MiRouter } from "./router.js"
import { generateToken, passportCall } from "../utils.js"

export class SessionsRouter extends MiRouter{
    init(){
        this.post("/signup", ["PUBLIC"], passportCall("signup"), (req,res)=>{

            return res.successAlta("Registro correcto...!!!", req.user)
        })

        this.post("/login", ["PUBLIC"], passportCall("login"), (req,res)=>{
            let token=generateToken(req.user)
            res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})
            return res.success(`Login correcto para el usuario ${req.user.first_name} ${req.user.last_name} , con rol: ${req.user.role}`)
        })

        this.get("/current", ["PUBLIC"], passportCall("current"), (req,res)=>{
            let current = req.user
            return res.success(current)
        })

        this.get('/logout',["PUBLIC"], (req,res)=>{    
            res.clearCookie('coderCookie')
            return res.success('Se realizo el logout correctamente.')
        })
        
        this.get('/github', ["PUBLIC"], passportCall('github'), (req,res)=>{})
        
        this.get('/callbackGithub', ["PUBLIC"], passportCall('github'), (req,res)=>{
            let token=generateToken(req.user)
            res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})
            return res.success(`Login correcto para el usuario ${req.user.first_name}, con rol: ${req.user.role}`)
        })
        
        this.get('/errorGithub', ["PUBLIC"], (req,res)=>{
            return res.redirect(`/login?error=error al autenticar con GitHub`)
        })
    }
}
