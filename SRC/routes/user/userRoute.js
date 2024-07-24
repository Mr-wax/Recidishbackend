import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";
import { getallUsers,getSingleUser, updateUser,getSuggestedUsers, } from "../../controllers/userController.js"
import { deleteAllUsers, deleteUserById, freezeAccount } from "../../controllers/adminController.js";
import { authorize } from "../../middlewares/roleBasedAccess.js";
 const router = express.Router();

router.get("/", getallUsers)

router.get("/:id", protectRoute,getSingleUser)
router.delete("/delete-all", authorize, deleteAllUsers)
router.patch('/update/:id', protectRoute,updateUser)
router.delete("/delete/:id", authorize, deleteUserById)
router.post("/suggestions", protectRoute, getSuggestedUsers)
router.put("/freeze", authorize,freezeAccount);

export default router;