import User from "../models/UserModel.js";
import Post from "../models/postModel.js";
import { cloudinary } from "../utils/imageUpload.js";


// Controller for creating a new post with image upload
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let img;

      if (req.file) {
        const uploadedImg = await cloudinary.uploader.upload(req.file.path);
        img = uploadedImg.secure_url;
      }

      const postedBy = req.user._id;

      if (!text) {
        return res.status(400).json({ error: "Text field is required" });
      }

      const user = await User.findById(postedBy);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const maxlength = 1000;
      if (text.length > maxlength) {
        return res.status(400).json({ error: `Text should not exceed ${maxlength} characters` });
      }

      const newPost = new Post({
        postedBy,
        img,
        text
      });

      await newPost.save();
      res.status(200).json({ message: 'Post created successfully', newPost });
      console.log('Post created successfully', newPost);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    console.error('Internal server error:', error);
  }
};

// Controller to get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: 'Posts found successfully', posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get a single post by ID
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post found successfully', post });
  } catch (error) {
    console.error('Error fetching single post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to delete a post by ID
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the user deleting the post is the owner
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to delete this post' });
    }
    // Delete image from Cloudinary if it exists
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await post.delete();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to reply to a post
export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    console.error('Error replying to post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user._id } // Add user ID to likes array if not already present
    }, { new: true });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post liked successfully', post });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to unlike a post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id } // Remove user ID from likes array
    }, { new: true });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post unliked successfully', post });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
