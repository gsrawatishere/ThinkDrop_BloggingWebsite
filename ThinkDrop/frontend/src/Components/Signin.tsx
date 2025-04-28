import React, { useState } from 'react'
import axios from "axios"
import { BACKEND_URL } from './Config';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
  
     const handleSignin = async (e : React.FormEvent)=>{
        e.preventDefault();
        try{
            
        const response =  await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
                email : email,
                password : password
            })
            const token = response.data.token;
            localStorage.setItem("token",token)
            setEmail("");
            setPassword("");
            toast.success("Signin success!")
            navigate("/dashboard")
        }
        catch(error : any){
               toast.error(error?.response?.data?.msg || "Signin failed!")
        }
     }


    return (
        <div>
          <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                <img
                   className="w-12 h-12 mr-2 "
                   src="https://i.pinimg.com/474x/f4/42/79/f4427970aeac2be696f75bfbb7ae433f.jpg"
                   alt="logo"
                />
                ThinkDrop
              </a>
              <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Sign in to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Your email
                      </label>
                      <input
                        onChange={(e)=>(setEmail(e.target.value))}
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="name@gmail.com"
                        required
                      />
                    </div>
      
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Password
                      </label>
                      <input
                       onChange={(e)=>(setPassword(e.target.value))}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        required
                      />
                    </div>
      
                    <button
                      onClick={handleSignin}
                      type="button"
                      className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Sign in
                    </button>
      
                    <p className="text-sm font-light text-gray-500">
                      Don’t have an account?{" "}
                      <a
                        href="/"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        Sign up
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
}

export default Signin;