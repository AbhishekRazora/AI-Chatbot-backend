import { error } from "console";
import express from 'express'
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
// import path from "path";
const port = 5000;
/**************connections and listeners */



// const __dirname=path.resolve();
// app.use(express.static(path.join(__dirname,'../../frontend/dist')))

// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname,'frontend','dist','index.html'))

// })

connectToDatabase().then(()=>{

    app.listen(port, () => console.log(`server started at port:${port} and connected to database ✌️`))
}).catch((error)=>console.log(error))
