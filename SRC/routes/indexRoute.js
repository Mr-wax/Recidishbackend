import express from "express"
import authRoute from "../routes/auth/authRoute.js"
import postRoute from "../routes/Post/postRoute.js"
import userRoute from "../routes/user/userRoute.js"
import paymentRoute from "../routes/payment/paymenRoute.js"

const router = express.Router()

// router.use(authRoute, postRoute)
router.use('/auth', authRoute)
router.use('/post', postRoute)
router.use('/user', userRoute)
router.use('/payment', paymentRoute)
export default router
