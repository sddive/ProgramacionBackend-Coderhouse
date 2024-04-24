import { Router } from 'express'
import ViewController from '../controllers/view.controller.js'
import { auth } from '../middleware/authenticate.js'
import { access } from '../middleware/access.js'

const router = Router()
const viewController = new ViewController()

router.get('/', viewController.home)
router.get('/realtimeproducts', auth, viewController.realtimeproducts)
router.get('/chat', auth, access(['user']), viewController.chat)
router.get('/carts/:cid', viewController.cart)
router.get('/products', viewController.products)
router.get('/login', viewController.login)
router.get('/signup', viewController.signup)
router.get('/logout', viewController.logout)
router.get('/resetPassword01', viewController.resetPassword01)
router.get('/resetPassword02', viewController.resetPassword02)

export default router