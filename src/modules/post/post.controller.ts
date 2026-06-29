import type { NextFunction, Request, Response } from "express";
import { createService } from "./post.service";
import paginationSortingHeplers from "../../helpers/paginationSortingHeplers";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res:Response, next:NextFunction ) => {
  //      console.log(req.user,"jarin")
  // console.log(req.body)

  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    const result = await createService.createPost(req.body, user.id);
    return res.status(201).json({
      message: "success",
      data: result,
    });
  } catch (error) {
     next(error)
  }
};

const getAllpost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const { featured } = req.query;
    const authorId = req.query.auther;
    const autherIding = typeof authorId == "string" ? authorId : undefined;
    const isFeatured =
      typeof featured === "string"
        ? featured === "true"
          ? true
          : featured === "false"
            ? false
            : undefined
        : undefined;
    const tags = req.query.tag
      ? (req.query.tag as string).split(",")
      : undefined;
    const searching = typeof search === "string" ? search.trim() : undefined;
    console.log(searching);

    const { page, limit, skip, sortby, sortOrder } = paginationSortingHeplers(
      req.query,
    );

    const data = await createService.getAllPost({
      search: searching,
      tags,
      isFeatured,
      authorId: autherIding,
      page,
      limit,
      skip,
      sortby,
      sortOrder,
    });
    return res.status(200).json({
      message: "success",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};
const getSingleData = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const postIds = typeof postId === "string" ? postId : undefined;
    if (!postIds) {
      throw new Error("id not required");
    }
    const getID = await createService.getSingleData({ postId: postIds });
    res.status(200).json({
      message: "sucess",
      data: getID,
    });
  } catch (e) {
    console.log("getsingledata errror", e);
    res.status(400).json({
      message: "errror getsingeData",
      error: e,
    });
  }
};
const getMypost = async (req: Request, res: Response) => {
  console.log("MYPOSSTTTT");
  const user = req.user;
  console.log(user?.id);
  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }
  try {
    const result = await createService.getMypost(user.id);
    res.status(200).json({
      messsage: "success",
      data: result,
    });
  } catch (e) {
    console.log(e,"error")
  }
};

const postUpdate=async(req:Request,res:Response)=>{
  const user = req.user;
  const {postId}=req.params
 
  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }
  const isAdmin=user.role==UserRole.ADMIN
  try {
    const result = await createService.postUpdate(postId as string,req.body,user.id,isAdmin);
    res.status(200).json({
      messsage: "success",
      data: result,
    });
  } catch (e) {
    console.log(e,"error")
  }
}
const deletePost=async(req:Request, res:Response)=>{
      const {deleteId}=req.params
      const user=req.user
      const isAdmin= user?.role=== UserRole.ADMIN
      try{
        const result = await createService.deletePost(user?.id as string,deleteId as string,isAdmin)
        res.status(200).json({
          messsage:"delete sucess",
          data: result
        })
      }catch(e){
        console.log(e,"deleted errrrror")
        res.json({
          message:e
        })
      }

}
const getSatus=async(req:Request,res:Response)=>{
           
        try{
          const result= await createService.getStatus()
          res.status(200).json({
            messsage:"sucess",
            data:result
          })
        }catch (e){
          console.log(e,"getstatus")
        }
}

export const PostController = {
  createPost,
  getAllpost,
  getSingleData,
  getMypost,
  postUpdate,
  deletePost,
  getSatus
}; 
 