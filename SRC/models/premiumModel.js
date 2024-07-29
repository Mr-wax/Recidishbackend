import mongoose from "mongoose";


const premiumPostSchema = mongoose.Schema({
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
text:{
    type: String,
    maxlength:3000
  },
  title: {
    type: String,
    maxlength:400
  },
  ingredients: {
    type: String,
    required: true,
    maxlength:3000
  },
  recommendations: {
    type: String,
    maxlength:3000
  },
  tips:{
   type: String,
   maxlength:3000
  },
  category: {
     type: String,
     required: true,
      enum:["rice", "soup","stew", "snacks"] }, 
  img:{
    type: String,
    default: ''
  },
  likes: {
    type:[mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  },


  recentSearches: [String],  
  interactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
  
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      text:{
        type: String,
        required: true
      },
      userProfilePic:{
        type: String
      },
      userName:{
        type: String,
      },

    },
  ],

}, {
  timestamps: true
}
);

const premiumPost = mongoose.model("premiumPost", premiumPostSchema);

export default premiumPost;



