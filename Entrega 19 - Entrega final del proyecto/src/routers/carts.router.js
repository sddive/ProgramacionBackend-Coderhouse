import { Router } from 'express'
import CartController from '../controllers/cart.controller.js'
import { auth } from '../middleware/authenticate.js'
import { access } from '../middleware/access.js'

const router = Router()
const cartController = new CartController()

router.post('/', cartController.addCart)
router.get('/:cid', cartController.getProductsToCart)
router.post('/:cid/product/:pid', auth, access(['user']), cartController.addProduct)
router.put('/:cid/product/:pid', auth, access(['user']), cartController.updateProduct)
router.put('/:cid', auth, access(['user']), cartController.updateAllProducts)
router.delete('/:cid/product/:pid', auth, access(['user']), cartController.deleteProduct)
router.delete('/:cid', auth, access(['user']), cartController.deleteAllProduct)
router.get('/:cid/purchase', auth, access(['user']), cartController.purchaseCart)

export default router