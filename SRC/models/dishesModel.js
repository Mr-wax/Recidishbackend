import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    isForSale: {
        type: Boolean,
        required: true
    },
    categories:{
        type: Array,
        required:false
    }

},{timestamps});

const Product = mongoose.model('Product', productSchema);

export default Product;