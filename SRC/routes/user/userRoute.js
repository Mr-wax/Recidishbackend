import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";
import { getallUsers, deleteAllUsers,deleteSingleUser,getSingleUser, updateUser,getSuggestedUsers, freezeAccount } from "../../controllers/userController.js"

const router = express.Router();

router.get("/", getallUsers)
router.get("/", getSingleUser)
router.get("/:id", protectRoute,getSingleUser)
router.delete("/delete-all", deleteAllUsers)
router.patch('/update/:id', updateUser)
router.delete("/delete/:id", deleteSingleUser)
router.post("/suggestions", protectRoute, getSuggestedUsers)
router.post("/follow/:id", protectRoute,);
router.put("/freeze", protectRoute, freezeAccount);

export default router;