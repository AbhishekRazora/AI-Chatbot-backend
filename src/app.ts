import express,{Request,Response} from "express";
import { config } from "dotenv";
import morgan from "morgan"
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import  cors  from "cors";
config();
const app = express()


/**********middlewares******** */
// app.use(cors({origin:'http://localhost:5173',credentials:true}))
app.use(cors({origin:'https://ai-chatbot-frontend-9jh6.onrender.com',credentials:true}))
// app.use(cors())
app.use(express.json())

app.use(morgan('dev'))

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use("/api/v1",router)

// app.post("/hello",(req,res,next)=>{
//   console.log(req.body.name)
//   return res.send('hello');
// })

app.get("/health",async(req:Request,res:Response)=>{
res.send({message:"health OK!"});
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal server Error";
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    })

})

export default app;