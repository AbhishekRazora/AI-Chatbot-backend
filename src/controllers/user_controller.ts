import { Request, Response,NextFunction } from "express";
import User from "../models/User.js"
import { hash,compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";



export const getAllUsers=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        const users=await User.find();
        return res.status(200).json({
            success:true,message:"Ok",users
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
        
    }
}
export const userSignUp=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email})
        if(existingUser){
            // return(
            //     res.status(401).send('User already registered')
            // )

            return (
                res.status(401).json({
                    success:false,
                    message:"User already registered"
                })
            )
        
            
        }
        const hashedPassword=await hash(password,10)
        const user=new User({name,email,password:hashedPassword});
        await user.save();


        
res.clearCookie(COOKIE_NAME,{
    path:'/',
    // domain:"localhost",
    domain:"https://ai-chatbot-frontend-9jh6.onrender.com",
    
    httpOnly:true,
    signed:true,
})

const token=createToken(user._id.toString(),user.email,"7d");
const expires=new Date()
expires.setDate(expires.getDate()+7);

res.cookie(COOKIE_NAME,token,{
    path:'/',
    // domain:"localhost",
    domain:"https://ai-chatbot-frontend-9jh6.onrender.com",
    expires,
    httpOnly:true,
    signed:true,
})


        return res.status(201).json({
            success:true,message:"Ok,user created",name:user.name,email:user.email
        })

    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}





export const userSignIn=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        const {email,password}=req.body;
       const user=await User.findOne({email:email})
if(!user){
    return res.status(400).json({success:false,message:"User not registered"})
}

const isPasswordCorrect=await compare(password,user.password)

if(!isPasswordCorrect){
    return res.status(403).json({success:false,message:"Incorrect credentials"})
}

res.clearCookie(COOKIE_NAME,{
    path:'/',
    // domain:"localhost",
    domain:"https://ai-chatbot-frontend-9jh6.onrender.com",
    
    httpOnly:true,
    signed:true,
})

const token=createToken(user._id.toString(),user.email,"7d");
const expires=new Date()
expires.setDate(expires.getDate()+7);

res.cookie(COOKIE_NAME,token,{
    path:'/',
    // domain:"localhost",
    domain:"https://ai-chatbot-frontend-9jh6.onrender.com",
    expires,
    httpOnly:true,
    signed:true,
})

        return res.status(200).json({
            success:true,message:"Ok,sign-in successfully",name:user.name,email:user.email
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}



export const verifyUser=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        // const {email,password}=req.body;
       const user=await User.findById(res.locals.jwtData.id);
if(!user){
    return res.status(401).json({success:false,message:"User not registered or token mulfunctioned"})
}
if(user._id.toString()!== res.locals.jwtData.id){
    return res.status(401).json({success:false,message:"Permissions didn't match"})
}


        return res.status(200).json({
           success:true, message:"Ok,sign-in successfully",name:user.name,email:user.email
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}
export const userLogout=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        // const {email,password}=req.body;
       const user=await User.findById(res.locals.jwtData.id);
if(!user){
    return res.status(401).json({success:false,message:"User not registered or token mulfunctioned"})
}
if(user._id.toString()!== res.locals.jwtData.id){
    return res.status(401).json({success:false,message:"Permissions didn't match"})
}
res.clearCookie(COOKIE_NAME,{
    path:'/',
    // domain:"localhost",
    domain:"https://ai-chatbot-frontend-9jh6.onrender.com",
    
    httpOnly:true,
    signed:true,
})

        return res.status(200).json({
           success:true, message:"Ok,logout successfully",name:user.name,email:user.email
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}