import { Router } from 'express'
import ProductController from '../controllers/product.controller.js'

const router = Router()
const productController = new ProductController()

router.get('/', productController.getProducts)
router.get('/:idProduct', productController.getProductById)
router.post('/', productController.addProduct)
router.put('/:idProduct', productController.updateProduct)
router.delete('/:idProduct', productController.delete)

export default router