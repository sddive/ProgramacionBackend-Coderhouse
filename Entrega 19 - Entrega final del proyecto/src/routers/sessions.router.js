import { Router } from 'express'
import passport from 'passport'
import SessionsController from '../controllers/sessions.controller.js'

const router = Router()
const sessionController = new SessionsController()

router.post('/login', passport.authenticate('login',{failureRedirect:'/login?error=credenciales incorrectas', session: false}), sessionController.login)
router.post('/signup', passport.authenticate('signup',{failureRedirect:'/signup?error=error al registrar, reintente nuevamente', session: false}), sessionController.signup)
router.get('/logout',sessionController.logout)
router.get('/github', passport.authenticate('github',{session: false}), sessionController.github)
router.get('/callbackGithub', passport.authenticate('github',{failureRedirect:'/api/sessions/errorGithub', session: false}), sessionController.callbackGithub)
router.get('/errorGithub', sessionController.errorGithub)
router.get("/current", passport.authenticate('current',{session: false}), sessionController.current)
router.post("/resetPassword01", sessionController.resetPassword01)
router.get("/resetPassword02", sessionController.resetPassword02)
router.post("/resetPassword03", sessionController.resetPassword03)

export default router