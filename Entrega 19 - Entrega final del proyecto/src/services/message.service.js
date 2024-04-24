import Message from "../dao/classes/message.dao.js";

class MessageService {
    
    constructor(){
        this.messageDAO = new Message()
    }

    async getMessages(){
        try {
            return await this.messageDAO.get()
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async addMessage(newMessage){
        try {
            return await this.messageDAO.create(newMessage)
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}

export const messageService = new MessageService()