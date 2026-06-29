import { error } from "node:console";
import type { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
   await prisma.post.findUniqueOrThrow({
    where:{
      id:payload.postId
    }
   })
   if(payload.parentId){
    await prisma.comment.findUniqueOrThrow({
      where:{
        id:payload.parentId
      } 
    })
   }
  
  const commentData = await prisma.comment.create({
    data: payload,
  });
  return commentData
};
const getcomment= async( commentid:string)=>{
       const existingcomment=await prisma.comment.findUnique({
        where:{
          id:commentid
        },
        include:{
          post:{
            select:{
              id:true,
              title:true
            }
          }
        }
       })
       return existingcomment
}

const deleteComment=async(id:string,authorId:string)=>
{     console.log(id,authorId,"user")
   try{
         const  exsitingUser= await prisma.comment.findUnique({
          where: {
            id,authorId
          }
             })
         if(!exsitingUser){
          throw new Error("Your provided input is invalid!")
         }
         return await prisma.comment.delete({
          where:{
            id:exsitingUser.id
          }
         })
          
}catch(e){
  console.log(e,"deleteComment")
}
      
}

const modaretComment= async( commentId:string, data:{ status:CommentStatus})=>{
       console.log(commentId,data,"modaretComment")
       const commentData= await prisma.comment.findUniqueOrThrow({
        where:{
          id:commentId
        }
       })
       if(commentData.status===data.status){
         throw new Error(`your provite status("${data.status} alredy up to date`)
       }
       return await prisma.comment.update({
        where:{
          id: commentId
        },
         data  
       }) 
}

export const CommentService = { createComment ,getcomment ,deleteComment,modaretComment};   
