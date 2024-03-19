import { messageModel } from "../models/message.model.js";

export default class Message{

    async get(){
        try {
            return await messageModel.find().lean()
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async create(newMessage){
        try {
            let message = await messageModel.create(newMessage)
            return message     
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}
