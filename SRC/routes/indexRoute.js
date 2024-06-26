import express from "express"
import authRoute from "../routes/auth/authRoute.js"
import postRoute from "../routes/Post/postRoute.js"

const router = express.Router()

router.use(authRoute, postRoute)
router.use('/auth', authRoute)

export default router
