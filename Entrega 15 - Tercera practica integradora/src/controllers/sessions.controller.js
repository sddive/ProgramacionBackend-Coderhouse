import { generateToken } from "../utils.js"

export default class SessionsController{

    signup = async(req, res)=>{    
        res.redirect(`/login?mensaje=Usuario ${req.user.email} registrado correctamente`)
    }
    
    login = async(req, res)=>{   
        let token = generateToken(req.user)
        res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60})       
        res.redirect('/products')
    }
    
    logout = (req,res)=>{    
        res.clearCookie('coderCookie')    
        res.redirect('/login')    
    }
    
    github = (req,res)=>{}
    
    callbackGithub(req,res){
        let token = generateToken(req.user)
        res.cookie("coderCookie", token, {httpOnly:true, maxAge: 1000*60*60}) 
        res.redirect('/products')
    }
    
    errorGithub = (req,res)=>{
        return res.redirect(`/login?error=error al autenticar con GitHub`)
    }

    current = (req,res)=>{            
        let current = req.user
        return res.status(200).json({status:"OK", current})
    }
}