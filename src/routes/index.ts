import { Router } from "express";
import userRouter from "./user.js";
import chatRouter from "./chat.js";




const router=Router()


router.use("/user",userRouter)
router.use("/chat",chatRouter)


export default router;