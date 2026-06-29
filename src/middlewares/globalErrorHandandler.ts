import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err:any, req:Request, res:Response, next:NextFunction) {
  let statusCode=500
  let  errorMessage="Internal server Error"
  let errorDetails=err
  res.status(500);
  if(err instanceof Prisma.PrismaClientValidationError ){
        statusCode=400
        errorMessage= "you provide  incorrect field type or missing fields!"
  }
  res.status(statusCode).json({
    message:errorMessage,
    error:errorDetails
  })
}
export default errorHandler;