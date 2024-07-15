import mongoose from "mongoose";


const postSchema = mongoose.Schema({
  postedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  text:{
    type: String,
    maxlength:1000
  },
  title: {
    type: String,
    maxlength:200
  },
  category: {
     type: String,
     required: true,
      enum:["rice", "soup","stew","meat"] }, 
  img:{
    type: String,
    default: ''
  },
  likes: {
    type:[mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  },

  recentSearches: [String],  // Array to store recent search queries
  interactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Array to store interacted posts
  
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

const Post = mongoose.model("Post", postSchema);

export default Post;



