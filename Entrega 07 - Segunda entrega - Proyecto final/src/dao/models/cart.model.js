import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products',
                    }, quantity: Number
                }
            ], default: []
        },
        deleted: {
            type: Boolean, default: false 
        }
    },
    {
        timestamps: true
    }
)

cartsSchema.pre("findOne", function(){
    this.populate({
        path: 'products.product'
    }).lean()
})


cartsSchema.pre("find", function(){
    this.populate({
        path: 'products.product'
    }).lean()
})

export const cartModel = mongoose.model(cartsCollection, cartsSchema)