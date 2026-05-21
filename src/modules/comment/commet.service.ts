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

export const CommentService = { createComment };
