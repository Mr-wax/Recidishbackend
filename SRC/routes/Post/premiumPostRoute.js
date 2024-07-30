import express from "express";
import { upload } from "../../utils/imageUpload.js";
import { createPost, deletePost, likePost, getLikedPosts, replyToPost, unlikePost, getPostsByCategory, getPostsByTitle, getSuggestedPosts, getSinglePost,getAllPosts } from "../../controllers/premiumPostController.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post("/premiumAdd", protectRoute, upload.single("img"), createPost);
router.post("/premiumReply/:id", protectRoute, replyToPost );
router.get("/premiumSinglePost/:id", protectRoute, getSinglePost);
router.get("/premiumPosts", protectRoute, getAllPosts)
router.post("/premiumLike/:id", protectRoute, likePost );
router.post("/premiumUnlike/:id", protectRoute, unlikePost );
router.get("/premiumGetSuggestedPosts", protectRoute, getSuggestedPosts);
router.get("/premiumGetLikedPosts", protectRoute, getLikedPosts);
router.get("/premiumGetPostsByCategory/filter", protectRoute, getPostsByCategory);
router.get("/premiumGetPostsByTitle/filter/:id", protectRoute, getPostsByTitle);
router.delete("/premiumDeleteSingle", protectRoute, deletePost);

export default router;