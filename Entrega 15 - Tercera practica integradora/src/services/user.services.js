import User from "../dao/classes/user.dao.js";

class UserService {
    
    constructor(){
        this.userDAO = new User()
    }

    async getByEmail(email){
        try {
            return await this.userDAO.getByEmail(email)
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async updateUser(user){
        try {
            console.log(user)
            console.log('en service de usuario')
            return await this.userDAO.update(user)
        } catch (error) {
            throw new Error(error.message)  
        }
    }
}

export const userService = new UserService()