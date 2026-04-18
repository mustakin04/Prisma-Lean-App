import express, { type Application } from "express"
import postRouter from "./modules/post/post.router"
import cors from "cors"
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
const app :Application=express()

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Hellow  world")
})
app.use("/posts",postRouter)

export default app