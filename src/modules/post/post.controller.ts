import type { Request, Response } from "express";
import { createService } from "./post.service";


const createPost =async(req:Request,res:Response)=>{
    
  console.log(req.body)
  try{
    const result= await createService.createPost(req.body)
    res.status(201).json({
      message:"success",
      data:result
    })
  }catch(error){
    res.json(error)
  }
}

export const PostController={createPost}