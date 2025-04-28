import { Header } from "./Dashboard"
import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "./Config"
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";



interface Blog {
    id: string;
    title: string;
    content: string;
    createdAt: string;
   
  }

const Myblogs = () => {
 
    const [myblogs, setMyblogs] = useState<Blog[]>([]);

    async function  getBlogs(){
        const token = localStorage.getItem("token");
         const response = await axios.get(`${BACKEND_URL}/api/v1/blog/myblogs`,{
            headers : {
                authorization : `Bearer ${token}`
            }
         })
         setMyblogs(response.data.myblogs); 
         console.log(response.data.myblogs)    
}
    useEffect(()=>{
        getBlogs();
     },[])
    

  return (
    <div>
                <Header  showExtraDiv={false} name={""}/>
                <div>
        {myblogs.length > 0 ? (
          myblogs.map((blog) => (
            
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              content={blog.content}
              publishedDate={blog.createdAt}
              fetchBlogs={getBlogs}    
              
            />
          ))
        ) : (
          <p className='text-center pt-4 font-bold' >No Blogs Found</p>
        )}
      </div>
    </div>
  )
}


interface Cardprops {
    id : string,
    title : string,
    content : string,
    publishedDate : string
    fetchBlogs: () => void;
}



const BlogCard = ({
    id,
    title,
    content,
    publishedDate,
    fetchBlogs
}: Cardprops)=>{
     
    const handleDelete = async ()=>{
        try{
            const token = localStorage.getItem("token");
           await axios.delete(`${BACKEND_URL}/api/v1/blog/blogdelete/${id}`,{
            headers : {
                authorization : `Bearer ${token}`
            }
         })
         
          toast.success("Blog deleted Successfully!")
          fetchBlogs();
        
        }
        catch(error : any){
            toast.error(error?.response?.data?.msg || "Failed to delete blog!")
             console.log(error);
        }

    }

    const formattedDate = new Date(publishedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      
   return (
    <div className=' w-full flex flex-col p-4 border-b border-slate-200 pb-8 pt-6 shadow shadow-slate-50 px-6  ' >
           <div className='flex justify-between '>  
        <div className=' text-slate-600 md:text-lg  '> {formattedDate} </div>
         <div>
         <button onClick={handleDelete} className=" text-2xl md:text-3xl  hover:text-red-700 transition-colors duration-300">
  <MdDelete />
</button>
       </div>
           </div>
           <div className='text-2xl font-bold py-1.5' >
            {title}
           </div>
           <div  > 
            {content}
           </div >
           <div className='text-slate-600 flex justify-between pt-6' >
                    <div> {`${Math.ceil(content.length/200)} Min Read`}</div>
                   
           </div>
    </div>
   )

}

export default Myblogs