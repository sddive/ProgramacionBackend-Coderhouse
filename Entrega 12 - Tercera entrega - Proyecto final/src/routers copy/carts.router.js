import { Router } from 'express'
import CartController from '../controllers/cart.controller'

const router = Router()
const cartController = new CartController()

router.post('/', cartController.addCart)
router.get('/:cid', cartController.getProductsToCart)
router.post('/:cid/product/:pid', cartController.addProduct)
router.put('/:cid/product/:pid', cartController.updateProduct)
router.put('/:cid', cartController.updateAllProducts)
router.delete('/:cid/product/:pid', cartController.deleteProduct)
router.delete('/:cid', cartController.deleteAllProduct)

export default router