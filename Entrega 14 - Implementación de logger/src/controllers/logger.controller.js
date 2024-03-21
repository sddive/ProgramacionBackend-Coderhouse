import { errorHandler } from "../middleware/errorHandler.js"

export default class LoggerController {

    async loggerTest(req, res){
        try {
            req.logger.debug('TEST logger in level debug')
            req.logger.http('TEST logger in level http')
            req.logger.info('TEST logger in level info')
            req.logger.warning('TEST logger in level warning')
            req.logger.error('TEST logger in level error')
            req.logger.fatal('TEST logger in level fatal')
            res.setHeader('Content-Type','application/json')
            res.status(200).json({ status: 'success', message: 'LoggerTest ejecuto correctamente, revise el log.'})

        } catch (error) {
            errorHandler(error, req, res)
        }  
    }
}