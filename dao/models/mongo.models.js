import mongoose from "mongoose";

const productCollection = "products"
const messageCollection = "messages"
const cartCollection = "carts"

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true, strict: false
    }
);

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    }
)

const cartSchema = mongoose.Schema({
    id: { type: Number, require: true },
    timestamp: { type: String, require: true },
    products: [productSchema]
})

const MongoProduct = mongoose.model(productCollection, productSchema)
const MongoMessage = mongoose.model(messageCollection, messageSchema)
const MongoCart = mongoose.model(cartCollection, cartSchema)

export { MongoProduct, MongoMessage, MongoCart}