import type { Request, Response } from "express";
import { createService } from "./post.service";


const createPost =async(req:Request,res:Response)=>{
  //      console.log(req.user,"jarin")
  // console.log(req.body)
    
  try{
    const user=req.user
    if(!user){
      return res.status(400).json({
        message:"user not found"
      })
    }
    const result= await createService.createPost(req.body , user.id)
    return res.status(201).json({
      message:"success",
      data:result
    })
  }catch(error){
    res.json(error)
  }
}

export const PostController={createPost}