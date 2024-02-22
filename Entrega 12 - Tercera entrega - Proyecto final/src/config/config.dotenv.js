import dotenv from "dotenv"

const result = dotenv.config({
    override: true,
    path: './src/.env'
})

export const config = {
    PORT: process.env.PORT||8081,
    mongo_URL: process.env.mongo_URL,
    dbName: process.env.dbName,
    clientID: process.env.clientID, 
    clientSecret: process.env.clientSecret, 
    SECRET_KEY: process.env.SECRET_KEY
}