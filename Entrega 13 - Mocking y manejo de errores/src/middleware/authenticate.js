import { decodeToken } from "../utils.js"
import { errorHandler } from "./errorHandler.js";
import { STATUS_CODES } from "../utils/codeError.js";

export const auth = (req, res, next) => {
    console.log(req.user)
    if (!req.cookies.coderCookie) {
        res.setHeader('Content-Type', 'application/json');
        return res.redirect('/login?error=debe iniciar sesion para realizar la compra');
    }

    let token = req.cookies.coderCookie

    try {
        req.user = decodeToken(token)
        next()
    } catch (error) {
        const err = new CustomError('Authentication Error', STATUS_CODES.ERROR_AUTENTICACION, 'To use the resource you must log in')
        errorHandler(err, req, res)
    }
}