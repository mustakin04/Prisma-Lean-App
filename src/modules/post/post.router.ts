import express, { type NextFunction, type Request, type Response } from "express"
import { PostController } from "./post.controller"
import {auth as butterauth}  from "../../lib/auth"
import auth, { UserRole } from "../../middlewares/auth"
// import { success } from "better-auth"
const router =express.Router()
router.get("/getData",PostController.getAllpost)
router.post("/", auth(UserRole.USER) ,PostController.createPost)
export default router  

