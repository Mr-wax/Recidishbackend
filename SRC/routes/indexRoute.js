import express from "express"
import authRoute from "../routes/auth/authRoute.js"
import postRoute from "../routes/Post/postRoute.js"
import user from "../routes/user/userRoute.js"

const router = express.Router()

// router.use(authRoute, postRoute)
router.use('/auth', authRoute)
router.use('/post', postRoute)

export default router
