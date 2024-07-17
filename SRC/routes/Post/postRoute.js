import express from "express";
import {upload} from "../../utils/imageUpload.js"
import { createPost, getAllPosts, getSinglePost, getSuggestedPosts, deletePost, getPostsByTitle, likePost, unlikePost, replyToPost, trackUserSearch, getPostsByCategory} from "../../controllers/PostController.js"
import protectRoute from "../../middlewares/protectRoute.js"; 
// import  authenticateToken  from "../../middlewares/roleBasedAccess.js";
const router = express.Router()


router.post("/add", protectRoute ,upload.single("img"),createPost);
router.get("/", protectRoute, getAllPosts);
router.get("/id/:id", protectRoute, getSinglePost);
router.delete("/id/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likePost);
router.post("/reply/:id", protectRoute, replyToPost);
router.post("/unlike/:id", protectRoute, unlikePost);
router.post("/tracksearch",protectRoute, trackUserSearch);
router.get("/suggested", protectRoute, getSuggestedPosts);
router.get("/filter", protectRoute, getPostsByCategory);
router.get("/filter/:id", protectRoute, getPostsByTitle);

//admin routes
// router.delete('/posts/:id', authenticateToken, authorizeRole(['admin']), postController.deletePost);


export default router



