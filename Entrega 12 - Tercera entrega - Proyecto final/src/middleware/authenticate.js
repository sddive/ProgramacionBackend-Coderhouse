import { decodeToken } from "../utils.js"

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
        return res.status(401).json({ error: error.message })
    }
}