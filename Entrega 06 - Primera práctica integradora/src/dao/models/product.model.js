import mongoose from "mongoose";

const productsCollection = 'products'
const productsSchema=new mongoose.Schema(
    {
        title: String, 
        description: String, 
        price: Number, 
        thumbnail: {
            type: [String], default: []
        },  
        code: {
            type: String, unique:true, required: true 
        },
        stock: Number, 
        category: String,    
        status: Boolean,

        nombre: String, 
        apellido: String,
        email:String, 
        edad: Number, 
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true
    }
)

export const productModel = mongoose.model(productsCollection, productsSchema)