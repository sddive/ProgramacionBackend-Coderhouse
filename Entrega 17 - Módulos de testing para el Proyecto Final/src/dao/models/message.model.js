import mongoose from "mongoose";

const messagesCollection = 'messages'
const messagesSchema = new mongoose.Schema(
    {
        user: {
            type: String, required: true
        },
        message: {
            type: String, required: true
        }
    },
    {
        timestamps: true
    }
)

export const messageModel = mongoose.model(messagesCollection, messagesSchema)