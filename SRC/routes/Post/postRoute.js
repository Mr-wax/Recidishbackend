import express from "express";
import { createPost, getAllPosts, getSinglePost, deletePost, likePost, unlikePost, replyToPost} from "../../controllers/PostController.js"
import protectRoute from "../../middlewares/protectRoute.js"; 
const router = express.Router()
// import { signUp, signIn} from "../auth/authRoute.js"

router.post("/add", protectRoute ,createPost)
router.get("/", protectRoute, getAllPosts)
router.get("/:id", protectRoute, getSinglePost)
router.delete("/:id", protectRoute, deletePost)
router.put("/like/:id", protectRoute, likePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.put("/unlike/:id", protectRoute, unlikePost);

export default router



