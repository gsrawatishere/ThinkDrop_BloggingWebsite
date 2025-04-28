import React, { useState } from 'react'
import { Header } from './Dashboard'
import toast from 'react-hot-toast'
import axios from 'axios'
import { BACKEND_URL } from './Config'
import { useNavigate } from 'react-router-dom'

const UploadBlog = () => {
  return (
    <div>
        <Header  showExtraDiv={false} name={"hell"}/>
        <Input/>
        
    </div>
  )
}


const Input = ()=>{
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const navigate = useNavigate();

 const handlePost = async (e : React.FormEvent)=>{
         e.preventDefault();
         const token = localStorage.getItem("token")
         try{
          const response =  await axios.post(`${BACKEND_URL}/api/v1/blog/blogpost`,{
                title : title,
                content : content
             },
             {
                headers : {
                    authorization : `Bearer ${token}`
                }
             }
            )
            setTitle("");
            setContent("");
            toast.success(response.data.msg)
            navigate("/dashboard")
         }
         catch(error : any){
            toast.error(error?.response?.data?.msg || "Failed to Post Blog!")
         }
 }

    return (
        <div>
               <div className='px-8 py-8' >
               <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
       <div className='text-2xl font-bold text-slate-700 md:text-3xl lg:text-4xl' > Title</div>
</label>
<textarea onChange={(e:any)=>{setTitle(e.target.value)}}
  id="message"
  rows={2}
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Write your Blog Title here..."
></textarea>
               </div>

    <div className='px-8 py-4' >
               <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
       <div className='text-2xl font-bold text-slate-700 md:text-3xl lg:text-4xl' > Content </div>
</label>
<textarea onChange={(e:any)=>{setContent(e.target.value)}}
  id="message"
  rows={8}
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Write your Blog Title here..."
></textarea>
               </div>  
               <div  onClick={handlePost} className='w-full flex items-center justify-center pt-4' >
            <button type="button" className=' w-[200px] bg-blue-500  text-white py-1.5 text-xl shadow shadow-sky-100 rounded-lg 
            hover:bg-green-600'  >Post</button>
        </div>
         
        </div>
    )
}



export default UploadBlog;