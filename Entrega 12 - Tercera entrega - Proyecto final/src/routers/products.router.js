import { Router } from 'express'
import ProductController from '../controllers/product.controller.js'
import { auth } from '../middleware/authenticate.js'
import { access } from '../middleware/access.js'

const router = Router()
const productController = new ProductController()

router.get('/', productController.getProducts)
router.get('/:idProduct', productController.getProductById)
router.post('/', auth, access(['admin']), productController.addProduct)
router.put('/:idProduct', auth, access(['admin']), productController.updateProduct)
router.delete('/:idProduct', auth, access(['admin']), productController.delete)

export default router