import winston from 'winston'
import { config } from '../config/config.dotenv.js'

const nivels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}
  
const loggerDevelopment = winston.createLogger(
    {
        levels: nivels,
        transports: [
            new winston.transports.Console(
                { 
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.colorize({
                            colors: { fatal: "magenta", error: "red", warning: "yellow", info: "green", http: "cyan", debug: "blue"}
                        }),
                        winston.format.timestamp(),
                        winston.format.simple()
                    )
                }
            )
        ]    
    }
)
  
const loggerProduction = winston.createLogger(
    {
        levels: nivels,
        transports: 
        [
            new winston.transports.Console(
                {                
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize({
                            colors: { fatal: "magenta", error: "red", warning: "yellow", info: "green", http: "cyan", debug: "blue"}
                        }),
                        winston.format.timestamp(),
                        winston.format.simple()
                    )
                }
            ),
            new winston.transports.File(
                {
                    level:"error",
                    filename:"./src/logs/errors.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ) 
                }
            )
        ]
    }
)
  
export const middLogg = (req, res, next) => {
    if (config.MODE === 'prod') {
        req.logger = loggerProduction
    } else {
        req.logger = loggerDevelopment
    }

    next()
}
