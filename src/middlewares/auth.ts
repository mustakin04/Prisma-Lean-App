import express, { type NextFunction, type Request, type Response } from "express";
import {auth as butterauth} from "../../src/lib/auth"
export enum UserRole{
    USER="USER",
    ADMIN="ADMIN"
}
declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string;
                email:string;
                name:string;
                role:UserRole;
                emailVerified:boolean
            }
        }
    }
}

const auth=(...roles:any)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        console.log("ok coll")
        const session= await butterauth.api.getSession({
            headers:req.headers as any
        })

        console.log(session,"middleware")
        if(!session){
            return res.status(401).json({
                success:false,
                messsage: "yor are not authrized"
            })
        }
        if(!session.user.emailVerified){
             return res.status(401).json({
                success:false,
                messsage: "yor are not verify "
            })
        }
        if(roles.length && !roles.includes(session.user.role as UserRole)){
            return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resources!"
                })
        }
        req.user ={
            id:session.user.id,
            email:session.user.email,
            name:session.user.name,
            role:session.user.role as UserRole, 
            emailVerified:session.user.emailVerified
        }
        next()
    }
}
    export default auth;