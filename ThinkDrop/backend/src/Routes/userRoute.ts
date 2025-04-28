import { PrismaClient } from "@prisma/client";
import express from "express";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/config";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/signup",async (req : Request, res : Response) =>{
   try{
      const {email, name, password} = req.body;
       if(!email || !name || !password){
        console.log("Request body:", req.body);
        res.status(400).json({msg : "All fields are required!"})
        return ;
       }
       const existUser = await prisma.user.findUnique({
        where : {email}
       })
       if(existUser){
         res.status(401).json({msg : "User already exists! Please signin."})
         return ;
       }
       const hashedpassword = await bcrypt.hash(password,12);
       const newuser = await prisma.user.create({
        data : {
            email,
            name,
           password :  hashedpassword
        }
       })
       res.status(200).json({msg : "Signup Success! Please Signin", name : newuser.name})
   }
   catch(error){
       console.log("Erron in Signup Route",error);
       res.status(500).json({msg : "Error in Signup",error})
   }
})


router.post("/signin",async (req : Request, res : Response)=>{
    try{
          const {email, password} = req.body;
          if(!email || !password){
            res.status(400).json({msg : "All fields are required!"})
            return;
          }
          const existUser = await prisma.user.findUnique({
             where : {email}
          })
          if(!existUser){
            res.status(400).json({msg : "Email not found!"})
            return;
          }
        const isMatch = await bcrypt.compare(password,existUser.password);
        if(!isMatch){
            res.status(400).json({msg : "Invalid Password!"})
        }
       
        const token = jwt.sign({email : existUser.email},JWT_SECRET)
        res.status(200).json({msg : "Signin Success!", token : token})
    }
    catch(error){
          console.log("Error in Signin route",error);
          res.status(400).json({msg : "Error in Signup!",error})
    }
})

export default router;