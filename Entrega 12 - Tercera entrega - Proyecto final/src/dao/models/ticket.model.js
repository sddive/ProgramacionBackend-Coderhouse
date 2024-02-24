import mongoose from "mongoose";

const ticketsCollection = 'tickets'
const ticketsSchema = new mongoose.Schema(
    {
        code: {
            type: String, required: true, unique: true, inmutable: true,
            default: function() {
                // Generar un código único (por ejemplo, usando la fecha actual y un número aleatorio)
                const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '');
                const randomNum = Math.floor(Math.random() * 10000);
                return `TICKET-${timestamp}-${randomNum}`;
              }
        },
        amount: {
            type: Number, required: true
        },
        purchase_datetime: {
            type: Date, required: true, default: Date.now, inmutable: true
        },
        purchaser: {
            type: String, required: true
        }
    },
    {
        timestamps: true
    }
)

export const ticketModel = mongoose.model(ticketsCollection, ticketsSchema)