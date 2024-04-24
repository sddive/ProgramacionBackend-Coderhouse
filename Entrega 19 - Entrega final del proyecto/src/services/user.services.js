import User from "../dao/classes/user.dao.js";
import UserDTO from "../dto/user.dto.js";

class UserService {
    
    constructor(){
        this.userDAO = new User()
    }

    async getUsers(id){
        try {
            let userDTO
            let usersDTO
            let users = await this.userDAO.get()
            users.forEach(user => {
                userDTO = new UserDTO(user)
                usersDTO.push(userDTO)
            })
            return usersDTO
        } catch (error) {
            throw new Error(error.message)        
        }
    }

    async getById(id){
        try {
            let user = await this.userDAO.getById(id)
            if (user){
                return new UserDTO(user)
            }
        } catch (error) {
            throw new Error(error.message)        
        }
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