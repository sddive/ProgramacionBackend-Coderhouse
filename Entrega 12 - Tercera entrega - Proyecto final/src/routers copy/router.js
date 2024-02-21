import { Router } from 'express'
import { passportCall } from '../utils.js'

export class MiRouter{
    constructor(){
        this.router=Router()
        this.init()
    }

    init(){}

    getRouter(){
        return this.router
    }

    get(rute, permissions, ...functions){ // ... son aquí el operador rest, que alamacena los argumentos que lleguen en un array llamado functions
        this.router.get(rute, this.myResponses, (rute!=="/github" && rute!=="/callbackGithub")?passportCall("current"):(req,res,next)=>{next()}, this.access(permissions), this.agregaTryCatch(functions))
    }

    post(rute, permissions, ...functions){ // ... son aquí el operador rest, que alamacena los argumentos que lleguen en un array llamado functions
        this.router.post(rute, this.myResponses, (rute!=="/login" && rute!=="/signup")?passportCall("current"):(req,res,next)=>{next()}, this.access(permissions), this.agregaTryCatch(functions))
    }

    myResponses=(req, res, next)=>{
        res.success=(respuesta)=>res.status(200).json({status:"OK", respuesta})
        res.successAlta=(respuesta, itemNuevo)=>res.status(201).json({status:"OK", respuesta, itemNuevo})
        res.errorCliente=(error)=>res.status(400).json({status:"Bad Request", error})
        res.errorServer=(error)=>res.status(500).json({status:"Server Error", error})
        res.errorAuth=(error)=>res.status(401).json({status:"Auth Error", error})
        res.errorPermissions=(error)=>res.status(403).json({status:"Permisos incorrectos", error})
        next()
    }

    agregaTryCatch(functions){
        return functions.map(funcion=>{
            return async(...params)=>{
                try {
                    funcion.apply(this, params)
                } catch (error) {
                    params[1].errorServer("Error inesperado. Contacte al administrador. Detalle: "+error.message)
                }
            }
        })
    }

    access(permissions=[]){
        return (req,res,next)=>{
            permissions=permissions.map(p=>p.toLowerCase())

            if(permissions.includes("public")){
                return next()
            }

            // verificar que existe usuario logueado, que tenga un rol
            // y que el rol de ese usuario logueado, este incluído en los permissions
            if(!req.user || !req.user.rol){
                return res.errorAuth("No hay usuarios logueados")
            }

            if(!permissions.includes(req.user.rol.toLowerCase())){
                return res.errorPermissions("No tiene privilegios suficientes para acceder a este recurso... :(")
            }

            return next()
        }
    }


}