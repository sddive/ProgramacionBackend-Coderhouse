import { ticketModel } from "../models/ticket.model.js"

export default class Ticket{

    async create(ticket){
        try {
            const newTicket = await ticketModel.create(ticket)
            return newTicket     
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async get(){
        try {
            return await ticketModel.find().lean()
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getByCode(code){
        try {
            let ticket = await ticketModel.findOne(code)
            if (ticket){
                return ticket
            } else {
                return null
            }                
        } catch (error) {
            throw new Error(error.message)        
        }
    }
}