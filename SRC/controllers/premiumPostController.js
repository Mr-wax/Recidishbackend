import User from "../models/UserModel.js";
import Post from "../models/premiumModel.js";
import { upload, cloudinary } from '../utils/imageUpload.js';


export const createPost = async (req, res) => {
  try {
    const { text, category, title, ingredients, recommendations, tips } = req.body;
    const postedBy = req.user._id;

    console.log('Request body:', req.body); // Log the request body

    if (!text || !title) {
      return res.status(400).json({ error: "Title and Text fields are required" });
    }

    let img = null;

    if (req.file) {
      try {
        console.log('Uploading image to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
          uploadStream.end(req.file.buffer);
        });
        img = result.secure_url;
        console.log('Image uploaded successfully:', img);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).json({ error: 'Error uploading image' });
      }
    }

    console.log('Creating new post...');
    const newPost = new Post({
      postedBy,
      img,
      text,
      category,
      title,
      ingredients,
      recommendations,
      tips,
    });

    try {
      const post = await newPost.save();
      console.log('Post created successfully:', post);
      res.status(200).json({ message: 'Post created successfully', post });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: 'Posts found successfully', results: posts.length, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to delete this post' });
    }
    
    if (post.img) {
      console.log('Post image URL:', post.img);
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    
    await Post.deleteOne({ _id: req.params.id }); // Correct method to delete a document
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const replyToPost = async (req, res) => {
  try {
    console.log('Request Body:', req.body); 
    const text = req.body.text;
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


export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user._id } 
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


export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user._id } 
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

export const getLikedPosts = async (req, res) => {
  try {
    const likedPosts = await Post.find({ likes: req.user._id });

    if (likedPosts.length === 0) {
      return res.status(404).json({ message: 'No liked posts found' });
    }

    res.status(200).json({ message: 'Liked posts retrieved successfully', posts: likedPosts });
  } catch (error) {
    console.error('Error retrieving liked posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackUserSearch = async (req, res) => {
  try {
      const { searchQuery } = req.body;
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.recentSearches.push(searchQuery);
      if (user.recentSearches.length > 10) {
          user.recentSearches.shift();  
      }

      await user.save();

      res.status(200).json({ message: 'Search query tracked successfully' });
  } catch (error) {
      console.error('Error tracking search query:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


export const getSuggestedPosts = async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const recentSearches = user.recentSearches;
      const interactionHistory = user.interactionHistory;

      let suggestedPosts = await Post.find({
          $or: [
              { tags: { $in: recentSearches } },
              { _id: { $in: interactionHistory } }
          ]
      }).limit(20);  

      res.status(200).json({ message: 'Suggested posts found successfully', suggestedPosts });
  } catch (error) {
      console.error('Error fetching suggested posts:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


export const getPostsByCategory = async (req, res) => {
  try {
    const category  = req.query.category;
    console.log(category);

    const posts = await Post.find({ category });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found in this category' });
    }

    res.status(200).json({ message: 'Posts found successfully', posts });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostsByTitle = async (req, res) => {
  try {
    const  title  = req.query.title;

    const posts = await Post.find({ title: { $regex: title, $options: 'i' } });
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found with the given title' });
    }

    res.status(200).json({ message: 'Posts found successfully', posts });
  } catch (error) {
    console.error('Error fetching posts by title:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

