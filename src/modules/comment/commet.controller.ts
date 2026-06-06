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

const getComment=async(req:Request,res:Response)=>{
       const {id}=req.params
       try{
        const data= await CommentService.getcomment(id as string)
        res.status(200).json({
            message:"sucess",
            data:data
        })
       }catch(e){
        console.log(e,"getcomment")
        message: e
       }
}    



export const CommentController={createComment,getComment}