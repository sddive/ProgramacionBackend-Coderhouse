import { Router } from 'express'
import MockController from '../controllers/mock.controller.js'

const router = Router()
const mockController = new MockController()

router.get('/', mockController.generateProducts)

export default router