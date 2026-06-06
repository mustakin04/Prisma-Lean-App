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

export const CommentService = { createComment ,getcomment};
