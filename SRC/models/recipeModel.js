 import mongoose from "mongoose";
 
 const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Rice Recipes', 'Stew Recipes', 'Soup Recipes', 'Swallow Recipes','Chicken Recipes','Beans Recipes','Fish Recipes',''],
        // required:true 
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }]
});

export default recipe;

