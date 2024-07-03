import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema({
    cook: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required:true
    },
    img:{
        type: String,
        default:""
    },
    size: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    categories:{
        type: Array,
        required:false
    }

},{timestamps});

const Product = mongoose.model('Product', productSchema);

export default Product;