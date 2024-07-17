import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";
import { getallUsers, deleteAllUsers,deleteSingleUser,getSingleUser, updateUser,getSuggestedUsers, freezeAccount } from "../../controllers/userController.js"
// import { authenticateToken } from "../../middlewares/roleBasedAccess.js";
const router = express.Router();

router.get("/", getallUsers)

router.get("/:id", protectRoute,getSingleUser)
router.delete("/delete-all", deleteAllUsers)
router.patch('/update/:id', protectRoute,updateUser)
router.delete("/delete/:id",protectRoute,deleteSingleUser)
router.post("/suggestions", protectRoute, getSuggestedUsers)
router.put("/freeze", protectRoute, freezeAccount);

export default router;