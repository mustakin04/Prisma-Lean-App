import type { Request, Response } from "express";
import { createService } from "./post.service";
import paginationSortingHeplers from "../../helpers/paginationSortingHeplers";


const createPost = async (req: Request, res: Response) => {
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
    res.json(error);
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
 
     const {page,limit,skip,sortby,sortOrder} =paginationSortingHeplers(req.query)

    const data = await createService.getAllPost({
      search: searching,
      tags,
      isFeatured,
      authorId: autherIding,
      page,
      limit, 
      skip,
      sortby,
      sortOrder
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
const getSingleData=async(req:Request,res:Response)=>{
        try{
          const {postId}=req.params
        const postIds=typeof postId ==="string" ? postId:undefined
        if(!postIds){
          throw new Error("id not required")
        }
        const getID= await createService.getSingleData({postId:postIds})
          res.status(200).json({
            message:"sucess",
            data:getID
          })
        }catch(e){
          console.log("getsingledata errror",e)
          res.status(400).json({
            message:"errror getsingeData",
            error:e
        })
        }
}

export const PostController = { createPost, getAllpost ,getSingleData };   
