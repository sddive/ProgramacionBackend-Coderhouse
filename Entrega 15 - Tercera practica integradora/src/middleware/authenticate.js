import { decodeToken } from "../utils.js"
import { errorHandler } from "./errorHandler.js";
import { STATUS_CODES } from "../utils/codeError.js";
import { CustomError } from "../utils/customError.js";

export const auth = (req, res, next) => {
    try {
        console.log('authenticate req.user: ' + req.user)
        if (!req.cookies.coderCookie) {
            throw new CustomError('Authentication Error', STATUS_CODES.ERROR_AUTENTICACION, 'To use the resource you must log in')
        }

        let token = req.cookies.coderCookie
        req.user = decodeToken(token)
        next()
    } catch (error) {
        errorHandler(error, req, res)
    }
}