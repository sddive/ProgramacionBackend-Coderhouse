import mongoose from "mongoose";

const usersCollection = 'users'
const usersSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String, unique: true
        },
        password: String,
        role: {
            type: String, default: 'user'
        }
    },
    {
        timestamps: true
    }
)

export const userModel = mongoose.model(usersCollection, usersSchema)