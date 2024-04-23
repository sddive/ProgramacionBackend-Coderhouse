import { generateToken, decodeToken, createHash, validPassword } from "../utils.js"
import { userService } from "../services/user.services.js"
import { config } from "../config/config.dotenv.js"
import { sendEmail } from "../utils/mails.js"

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

    restorePassword01 = async (req,res)=>{
        try {
            let { email } = req.body
            let user = await userService.getByEmail(email)
    
            if (!user){
                return res.status(404).redirect('/restorePassword01?error=El email no existe');
            } else {
                let token = generateToken(user)
                let restorePassLink = `http://localhost:${config.PORT}/api/sessions/restorePassword02?token=${token}`
                let message = `Ha solicitado restablecer su contraseña. Haga click en el siguiente enlace: <a href="${restorePassLink}">Restablecer</a>`
    
                let response = await sendEmail(email, "Restaurar contraseña", message)
    
                if (response.accepted.length > 0){
                    return res.status(200).redirect('/restorePassword01?message=Se envio un correo para que pueda restaurar su contraseña.');
                } else {
                    return res.status(500).redirect('/restorePassword01?error=Huboo un problema al restaurar su contraseña, intente en unos minutos');
                }
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

    restorePassword02 = (req,res)=>{
        try {
            let { token } = req.query
            let user = decodeToken(token)
            if(!user){
                return res.status(400).redirect('/restorePassword01?error=El token es invalido o expiro')
            } else {
                return res.status(200).redirect('/restorePassword02?token=' + token)
            }
        } catch (error) {
            return res.status(500).redirect('/restorePassword01?error=Problem with your password reset detected' + error.message)
        }
    }

    restorePassword03 = async (req,res)=>{
        try {
            let {password01, token} = req.body
            let user = decodeToken(token)
            let errors
            console.log(user)
            if(!user){
                errors = `Error de usuario`
                return res.status(400).redirect('/restorePassword02?token=' + token + '&error=' + errors)
            }
            if(validPassword(user, password01)){
                errors = `Ha ingresado una contraseña utilizada en el pasado. No esta permitido`
                return res.status(400).redirect('/restorePassword02?token=' + token + '&error=' + errors)
            }

            let userUpdate = {...user, password:createHash(password01)}
            let userUpdate01 = await userService.updateUser(userUpdate)
    
            res.redirect("/login?mensaje=Contraseña restaurada...!!!")
        } catch (error) {
            return res.status(500).redirect('/restorePassword02?token=' + token + '&error=Error inesperado en el servidor - Intente más tarde, o contacte a su administrador')
        }
    }

}