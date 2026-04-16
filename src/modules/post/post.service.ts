import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost=async(data:Omit<Post,"id"|"updatedAt"|"createdAt">)=>{
     const  result= await prisma.post.create({
         data
     })
     return result;
}

export const createService={createPost}