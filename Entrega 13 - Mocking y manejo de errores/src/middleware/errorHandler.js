import { CustomError } from "../utils/customError.js";

export const errorHandler = (error, req, res, next)=>{
    if(error){
        if(error instanceof CustomError){
            console.log(`CustomError detectado: (${error.code}) - ${error.name}`)
            res.setHeader('Content-Type','application/json');
            return res.status(error.code).json({
                error:`${error.message}`,
                message: error.description?error.description:"Error inesperado en el servidor - Intente más tarde, o contacte a su administrador"
            })
        } else {
            res.setHeader('Content-Type','application/json');
            console.log(error.message)
            return res.status(500).json({status: 'error', message:'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador'})
        }
    }

    next()
}