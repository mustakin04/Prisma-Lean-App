import express, { Router } from "express"
import { CommentController } from "./commet.controller"
import auth, { UserRole } from "../../middlewares/auth"
const router=express.Router()


router.post("/",auth(UserRole.USER,UserRole.ADMIN) ,CommentController.createComment)
router.get("/getcomment/:id",CommentController.getComment)
router.delete("/deleted/:id",auth(UserRole.USER,UserRole.ADMIN))
router.patch("/:commentId/modaret",auth(UserRole.ADMIN),CommentController.modaretComment)
export   const  commetRouter:Router=router