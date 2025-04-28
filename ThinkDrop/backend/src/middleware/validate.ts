import { PrismaClient } from "@prisma/client";
import {Request, Response, NextFunction, response} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { json } from "stream/consumers";
const prisma = new PrismaClient();

 export interface CustomRequest extends Request{
    userId? : string,
    name? : string
}

export const userMiddleware = async (req : CustomRequest, res : Response, next : NextFunction)=>{
    try{
         const token = req.headers.authorization;
         
         if(!token || !token.startsWith("Bearer")){
            res.status(401).json({msg : "Unauthorized! Access Denied"})
            return;
         }
         const finaltoken = token.split(" ")[1];
  
        const data = jwt.verify(finaltoken, JWT_SECRET) as {email : string};
        const email = data.email;

        const user = await prisma.user.findUnique({
            where : {email : email}
        })
       if(!user){
         res.status(403).json({msg : "User not found. Access Denied!"})
         return
       }

       req.userId = user.id;
       req.name = user.name ?? undefined;
       
       next()
    }
    catch(error){
        console.log("Error in Middleware",error);
        res.status(400).json({msg : "Error in Authentication Middleware!"})
    }
}