import express, { type NextFunction, type Request, type Response } from "express"
import { PostController } from "./post.controller"
import {auth as butterauth}  from "../../lib/auth"
import auth, { UserRole } from "../../middlewares/auth"
// import { success } from "better-auth"
const router =express.Router()
router.get("/getData",PostController.getAllpost)
router.get("/status",auth(UserRole.ADMIN,UserRole.USER),PostController.getSatus)
router.post("/", auth(UserRole.USER) ,PostController.createPost)
router.get("/myPost",auth(UserRole.ADMIN,UserRole.USER),PostController.getMypost)
router.get("/:postId",PostController.getSingleData)
router.patch("/:postId",auth(UserRole.USER,UserRole.ADMIN), PostController.postUpdate)
router.delete("/:deleteId",auth(UserRole.ADMIN,UserRole.USER),PostController.deletePost)

export default router  

