import  { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from './Config';
import { useSearchParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

type BlogType = {
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
};

const Blog = () => {
  const [blogdata, setblogdata] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const pid = searchParams.get("id"); // correct
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!pid) return;
    setLoading(true);
    async function fetchBlogdata() {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/blog/blog`,
          { id: pid },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.blog;
        setblogdata(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogdata();
  }, [pid]);  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blogdata) {
    return <div>Blog not found</div>;
  }

  const formattedDate = new Date(blogdata.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (  


    
    <div className='w-full h-full flex flex-col justify-center items-center p-4 pt-6 px-8 sm:px-10 md:px-20'>

<div className=" w-full flex justify-end items-center text-4xl font-extrabold">
<button className='hover:text-blue-500'  onClick={()=>{navigate("/dashboard")}} > < RxCross2/></button>
    </div>

      <div className='flex'>
        <div className='pr-3 flex'>
         <button ><div className="  relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-600 rounded-full ">
    <span className="font-medium text-2xl text-white uppercase ">{blogdata.author.name[0]}</span>
</div></button>
        </div>
        <div className='font-medium md:text-lg'>{blogdata.author.name}</div>
        <div className='pl-1 text-slate-600 md:text-lg md:px-4'>{formattedDate}</div>
      </div>
      
      <div className='text-2xl font-bold  py-5'>
        {blogdata.title}
      </div>
      <div className='font-light'>
        {blogdata.content}
      </div>
      <div className='text-slate-600 flex justify-between pt-6'>
        <div>{`${Math.ceil(blogdata.content.length / 200)} Min Read`}</div>
      </div>
    </div>
  );
};

export default Blog;