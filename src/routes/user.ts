import { Router } from "express";
import { getAllUsers, userLogout, userSignIn, userSignUp, verifyUser } from "../controllers/user_controller.js";
import { signUpValidator, validate,signInValidator } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRouter=Router();

userRouter.get('/',getAllUsers)
userRouter.post('/sign-up',validate(signUpValidator),userSignUp)
userRouter.post('/sign-in',validate(signInValidator),userSignIn)
userRouter.get('/auth-status',verifyToken,verifyUser)
userRouter.get('/logout',verifyToken,userLogout)
export default userRouter;