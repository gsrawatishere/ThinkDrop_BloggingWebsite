import axios from 'axios';
import  { useEffect, useState } from 'react'
import { TfiWrite } from "react-icons/tfi";
import { BACKEND_URL } from './Config';
import { useNavigate } from 'react-router-dom';
import Blog from './Blog';


interface Blog {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      email: string;
    };
  }

const Dashboard = () => {
    
    
    const [blogsdata, setBlogsdata] = useState<Blog[]>([]);
    const [username, setUsername] = useState("");
    
    useEffect(()=>{
       async function  getBlogs(){
                const token = localStorage.getItem("token");
                 const response = await axios.get(`${BACKEND_URL}/api/v1/blog/allblogs`,{
                    headers : {
                        authorization : `Bearer ${token}`
                    }
                 })
                 setBlogsdata(response.data.blogs);
                 setUsername(response.data.username);
                 
        }
        getBlogs();
    },[])

  return (
    <div>
        <Header name={username} />
        <div>
        {blogsdata.length > 0 ? (
          blogsdata.map((blog) => (
            
            <BlogCard
              key={blog.id}
              id={blog.id}
              name={blog.author.name}
              title={blog.title}
              content={blog.content}
              publishedDate={blog.createdAt}
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
    name : string,
    title : string,
    content : string,
    publishedDate : string
}

const BlogCard = ({
    id,
    name,
    title,
    content,
    publishedDate
}: Cardprops)=>{
    const formattedDate = new Date(publishedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      const navigate = useNavigate();
   return (
    <div className=' w-full flex flex-col p-4 border-b border-slate-200 pb-8 pt-6 shadow shadow-slate-50 px-6  ' >
           <div className='flex  '>
        <div className='pr-3 flex justify-center items-center'> <button onClick={()=>{navigate("/dashboard")}} ><div className="  relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-600 rounded-full ">
    <span className="font-medium text-2xl text-white uppercase ">{name[0]}</span>
</div></button> </div>  
        <div className='font-medium md:text-lg ' >{name}. </div>
        <div className='pl-1 text-slate-600 md:text-lg md:px-4 '> {formattedDate} </div>
           </div>
           <div className='text-2xl font-bold py-1.5' >
            {title}
           </div>
           <div className=' line-clamp-3 md:line-clamp-2 lg:line-clamp-1' > 
            {content}
           </div >
           <div className='text-slate-600 flex justify-between pt-6' >
                    <div> {`${Math.ceil(content.length/200)} Min Read`}</div>
                    <div className='  hover:cursor-pointer  hover:text-black ' ><button onClick={()=>{navigate("/blog?id="+id)}} >Read More...</button></div>
           </div>
    </div>
   )

}

export const  Avatar = ({name} : {name : string})=>{
  const navigate =  useNavigate();
  const [isOpen, setIsOpen] = useState(false);
   
 const handleLogout = ()=>{
          localStorage.removeItem("token");
          navigate("/signin")
  }

    return(
<div>

<div>
<div className="relative inline-block ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center "
      >
        <button onClick={()=>{navigate("/dashboard")}} ><div className="  relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-600 rounded-full ">
    <span className="font-medium text-2xl text-white uppercase ">{name[0]}</span>
</div></button>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
 
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40  rounded-2xl bg-slate-100 shadow-md ">
          <ul>
            <li className="px-4 py-2 hover:font-bold  ">
              <a href="#"><button onClick={()=>{navigate("/myblogs")}} >My Blogs</button></a>
            </li>
            <li className="px-4 py-2 hover:font-bold  ">
              <a href="#"><button onClick={handleLogout} >Logout</button></a>
            </li>
          </ul>
        </div>
      )}
    </div>
  
</div>

</div>

    )
}
type Props = {
  showExtraDiv?: boolean;
  name : string
};


export const Header = ({name , showExtraDiv = true} : Props )=>{
  const navigate = useNavigate();
    return(
        <div className='flex justify-between px-6 py-3 border border-slate-100 shadow shadow-slate-50' >
                <div className='text-3xl font-bold font-serif hover:text-blue-700' >
                    <button onClick={()=>{navigate("/dashboard")}}>ThinkDrop</button>
                </div>

                <div className='flex items-center  '> 
               
                {showExtraDiv && (
        <div><button onClick={()=>{navigate("/uploadblog")}} className='pr-12 text-2xl hover:text-blue-600 hover:text-3xl '> 
        <TfiWrite /></button>
          </div>
      )}
               
               {showExtraDiv && (
        <div>
          <Avatar name={name}/>
          </div>
      )}
                </div>

                
        </div>
    )
}

export default Dashboard

