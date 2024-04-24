import { userModel } from "../models/user.model.js"
import mongoose from "mongoose";

export default class User{

    async create(user){
        try {
            const newUser = await userModel.create(user)
            return newUser     
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async get(){
        try {
            return await userModel.find().lean()
        } catch (error) {
            throw new Error(error.message)  
        }
    }
    
    async getById(id){
        try {
            if(mongoose.Types.ObjectId.isValid(id)){
                const user = await userModel.findOne({_id:id}).lean()
                return user
            }
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async getByEmail(email){
        try {
            const user = await userModel.findOne({email}).lean()
            return user
        } catch (error) {
            throw new Error(error.message)  
        }
    }

    async update(user){
        try {
            return await userModel.findOneAndUpdate({email:user.email},user)
        } catch (error) {
            console.log
            throw new Error(error.message)  
        }
    }
}