import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true
    }
)
productsSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productsCollection, productsSchema)