import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport';
import jwt from 'jsonwebtoken'
import { config } from './config/config.dotenv.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SECRET_KEY = config.SECRET_KEY

export const createHash = (password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validPassword = (user, password)=>bcrypt.compareSync(password, user.password)

export const passportCall=(strategy)=>{
    return function(req, res, next) {
        passport.authenticate(strategy, function(err, user, info, status) {
          if (err) { return next(err) }
          if (!user) {
                return res.errorCliente(info.message?info.message:info.toString())
          }
          req.user=user
          return next()
        })(req, res, next)
      }
}

export const generateToken=(user)=>jwt.sign({...user}, SECRET_KEY, {expiresIn: "1h"})
export const decodeToken=(token)=>jwt.verify(token, SECRET_KEY)

export default __dirname