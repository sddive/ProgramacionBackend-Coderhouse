import mongoose from "mongoose";

const productsCollection = 'products'
const productsSchema=new mongoose.Schema(
    {
        title: String, 
        description: String, 
        price: Number, 
        thumbnail: String,  
        code: {
            type: String, unique:true, required: true 
        },
        stock: Number, 
        category: String,    
        status: Boolean,

        nombre: String, 
        apellido: String,
        email: {
           type: String, unique:true, required: true 
        }, 
        edad: Number, 
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true,
        // collection: 'bigUsers',
        strict: false
    }
)

export const productModel = mongoose.model(productsCollection, productsSchema)