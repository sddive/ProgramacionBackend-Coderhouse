import mongoose from "mongoose";

const usersCollection = 'users'
const usersSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String, unique: true
        },
        age: Number,
        password: String,
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
        },
        role: {
            type: String, default: 'user'
        }
    },
    {
        timestamps: true
    }
)

export const userModel = mongoose.model(usersCollection, usersSchema)