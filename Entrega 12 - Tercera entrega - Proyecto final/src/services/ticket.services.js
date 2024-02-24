import Ticket from "../dao/classes/ticket.dao.js"

class TicketService {

    constructor(){
        this.ticketDAO = new Ticket()
    }

    async createTicket(ticket){
        try {
            return await this.ticketDAO.create(ticket)    
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async getTickets(){
        try {
            return await this.ticketDAO.get()
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }

    async getTicket(code){
        try {
            return await this.ticketDAO.getByCode(code)   
        } catch (error) {
            console.log(error.message)
            throw new Error(error.message)  
        }
    }
}

export const ticketService = new TicketService()