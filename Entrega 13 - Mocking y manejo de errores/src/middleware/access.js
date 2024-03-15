import { errorHandler } from "./errorHandler.js";
import { STATUS_CODES } from "../utils/codeError.js";
import { CustomError } from "../utils/customError.js";

export const access = (permisos=[])=>{
    return function(req, res, next){
        try {
            if(permisos.includes("PUBLIC")){
                return next()
            }
    
            if(!req.user){
                throw new CustomError('Authentication Error', STATUS_CODES.ERROR_AUTENTICACION, 'To use the resource you must log in')
            }
    
            if(!permisos.includes(req.user.role.toLowerCase())){
                throw new CustomError('Authentication Error', STATUS_CODES.ERROR_AUTORIZACION, 'You are not authorized to use the resource')
            }           
        } catch (error) {
            errorHandler(error, req, res)
            return
        }
        return next() 
    }
}
