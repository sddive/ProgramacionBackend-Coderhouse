import { Router } from 'express'
import { auth } from '../middleware/authenticate.js'
import UsersController from '../controllers/user.controller.js'


const router = Router()
const usersController = new UsersController()

router.get('/premium/:uid', auth, usersController.changePremium)

export default router