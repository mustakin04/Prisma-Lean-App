import type { Request, Response } from "express";
import { CommentService } from "./commet.service";



const createComment=async(req:Request,res:Response)=>{
      const user=req.user
      req.body.authorId=user?.id
         console.log(user,"cooooolll")   
    try{
        const returnComment=await CommentService.createComment(req.body)
        res.status(200).json({
            message: "success",
            data:returnComment
        })
    }catch(err){
    console.log(err,"commentcontroller")
    res.status(400).json({
        message:"comment.controller",
        err:err
    })
    }

}



export const CommentController={createComment}