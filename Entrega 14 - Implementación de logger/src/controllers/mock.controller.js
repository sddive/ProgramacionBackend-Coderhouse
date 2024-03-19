import { generateProduct } from "../mocks/products.mocks.js"
import { errorHandler } from "../middleware/errorHandler.js"

export default class MockController {

    async generateProducts(req, res){
        res.setHeader('Content-Type','application/json')
        try {
            const products = []
            for(let i=0; i<100; i++){
                products.push(generateProduct())
            }
            res.status(200).json({ status: 'success', payload: products })
        } catch (error) {
            errorHandler(error, req, res)
        }  
    }
}