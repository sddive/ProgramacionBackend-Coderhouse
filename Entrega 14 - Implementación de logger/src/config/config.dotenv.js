import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
    .option("-m, --mode <mode>", "Mode de ejecución del script (prod/dev)", "dev")

program.parse()

let opts=program.opts()
let validMode=["prod","dev"]
if(!validMode.includes(opts.mode.toLowerCase())){
    console.log("Solo se admiten los modos dev y prod")
    process.exit()
}

const mode=opts.mode

console.log('Ejecutando en modo: ' + mode)

const result = dotenv.config(
    {
        override: true,
        path:mode==="dev"?"./src/.env.development":"./src/.env.production"
    }
)

export const config = {
    PORT: process.env.PORT||8081,
    mongo_URL: process.env.mongo_URL,
    dbName: process.env.dbName,
    clientID: process.env.clientID, 
    clientSecret: process.env.clientSecret, 
    SECRET_KEY: process.env.SECRET_KEY,
    MODE: mode
}
