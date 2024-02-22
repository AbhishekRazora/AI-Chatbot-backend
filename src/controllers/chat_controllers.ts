import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import OpenAI, { OpenAIApi, ChatCompletionRequestMessage } from "openai";
export const generateChatCompletion = async (req: Request, res: Response, next: NextFunction) => {


    const { message } = req.body;

    try {

        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ success:false,message: "User not registered OR Token malfunctioned" })
        }

        // grab chats of user

        const chats = user.chats.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
        chats.push({ content: message, role: "user" })


        user.chats.push({ content: message, role: "user" });


        // send all chats with new one to openAI

        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        // get latest response
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats,
        })

        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ success:true,chats: user.chats });
    } catch (error) {
        console.log(error)

        return res.status(500).json({success:false, message: "something went wrong" })
    }

}

export const sendChatsToUser=async(req:Request,res:Response,next:NextFunction)=>{


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
           success:true, message:"Ok",chats:user.chats
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}
export const deleteChats=async(req:Request,res:Response,next:NextFunction)=>{


    try {
        // const {email,password}=req.body;
       const user=await User.findById(res.locals.jwtData.id);
if(!user){
    return res.status(401).json({success:false,message:"User not registered or token mulfunctioned"})
}
if(user._id.toString()!== res.locals.jwtData.id){
    return res.status(401).json({success:false,message:"Permissions didn't match"})
}
// @ts-ignore
user.chats=[]
await user.save();
        return res.status(200).json({
            success:true,
            message:"Ok"
        })
    } catch (error) {
        console.log(error)
        // return res.status(200).json({
        //     message:"ERROR",cause:error.message
        // })
        next(error)
    }
}