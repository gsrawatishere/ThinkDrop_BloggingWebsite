import express, {Request, Response} from 'express';
import { userMiddleware, CustomRequest } from "../middleware/validate";
import { PrismaClient } from '@prisma/client';
import { selector } from 'recoil';


const router = express.Router();
const prisma = new PrismaClient();

router.post("/blogpost", userMiddleware, async (req : CustomRequest, res : Response)=>{
     try{
         const {title, content} = req.body;
         if(!title || !content){
            res.status(400).json({msg : "All fields are required to post a blog!"})
            return;
         }
      const blog = await prisma.post.create({
        data : {
            title : title,
            content : content,
            authorid: req.userId!
        }
      })
      res.status(200).json({msg : "Blog posted successfully!",blog})
    
     }
     catch(error){
        console.log("Error in Blogpost route!",error)
        res.status(400).json({msg : "Error in Posting Blog!",error})

     }
})

router.put("/updateblog",userMiddleware,async (req : CustomRequest, res : Response)=>{
    try{
         let {id,title,content} = req.body;
         if(!id){
            res.status(400).json({msg : "Blog id not found!"})
            return;
         }
         const blogdata = await prisma.post.findUnique({
            where : {
                id : id
            }
         })
         if(!blogdata){
            res.status(400).json({msg : "Blog not found!"})
            return;
         }
         
         const updatedblog = await prisma.post.update({
            where : {
                id : id
            },
            data : {
                title : title || blogdata.title,
                content : content || blogdata.content
            }
         })

         res.status(200).json({
            msg : "Blog updated successfully",blog : updatedblog
         })
    }
    catch(error){
        console.log("Error in blogupdate route!",error);
        res.status(500).json({msg : "Error in posting blog "});
    }
})

router.post("/blog",userMiddleware,async (req : Request, res : Response)=>{
    try{
         const blogid = req.body.id;
         if(!blogid){
            res.status(400).json({msg : "blog id not found!"})
            return;
         }

         const blog = await prisma.post.findUnique({
              where : {
                id : blogid
              }
         ,
            select: {
                id : true,
                title: true,
                content: true,
                createdAt : true,
                author: {
                  select: {
                    name: true, 
                    email : true,
                  },
                },
              },
         })
         if(!blog){
            res.status(400).json({
                msg : "Blog not found!"
            })
            return;
         }
         res.status(200).json({blog : blog})
    }
    catch(error){
         console.log("Error in blog route",error);
         res.status(500).json({
            msg : "Error in fetching blog!"
         })
    }
})

router.get("/myblogs",userMiddleware,async(req:CustomRequest, res:Response)=>{
       try{
             const myblogs = await prisma.post.findMany({
               where : {
                 authorid : req.userId
               },
               orderBy: {
                createdAt: 'desc', 
              }
             })
             if(!myblogs){
              res.status(400).json({msg : "Blogs are not available!"})
              return;
             }
             res.status(200).json({myblogs : myblogs})
       }
       catch(error){
        console.log("Error in My Blogs Route",error);
        res.status(500).json({msg : "Error in fetching myblogs"})
       }
})

router.delete("/blogdelete/:id", userMiddleware, async(req : Request, res:Response)=>{
  try{
     const {id} = req.params;
     if(!id){
      res.status(400).json({msg : "Blog id not found!"})
      return;
     }
    const response = await prisma.post.delete({
      where : {
           id : id,
      }
    }) 
       res.status(200).json({msg : "Blog deleted Successfully!",blog : response})
  }
  catch(error){
         console.log("Error in delete blog route!",error)
         res.status(500).json({msg : "Error in Deleting Blog!"})
  }
})

router.get("/allblogs",userMiddleware,async(req : CustomRequest, res : Response)=> {
    try{
      const blog = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc', 
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
  
        if(!blog){
            res.status(400).json({msg : "Blogs are not available!"})
            return
        }
        res.status(200).json({blogs : blog,username : req.name})
    }
    catch(error){
        console.log("Error in All Blogs Route",error);
        res.status(500).json({msg : "Error in fetching blogs"})
    }
})




export default router;