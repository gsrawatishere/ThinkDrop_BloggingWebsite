import React, { useState } from 'react'
import axios from 'axios';
import { BACKEND_URL } from './Config';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e : React.FormEvent)=>{
         e.preventDefault();
          try{
                  await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
                    name : name,
                    email : email,
                    password : password
                 })
                 setEmail("");
                 setName("");
                 setPassword("");
                 toast.success('Signup Success! Please Signin')
                 navigate('/Signin')
          }
          catch(error : any){
                  toast.error(error?.response?.data?.msg || "Signup failed!")
          }
    }
    return (
        <div>
          <section className="bg-gray-50 h-full">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                <img
                  className="w-12 h-12 mr-2 "
                  src="https://i.pinimg.com/474x/f4/42/79/f4427970aeac2be696f75bfbb7ae433f.jpg"
                  alt="logo"
                />
                ThinkDrop
              </a>
              <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Create an account
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Your Name
                      </label>
                      <input
                        type="text"
                        onChange={(e)=>(setName(e.target.value))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="your name"
                        required
                      />
                    </div>
                    
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
                      onClick={handleSignup}
                      type="button"
                      className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Create an account
                    </button>
                    <p className="text-sm font-light text-gray-500">
                      Already have an account?{" "}
                      <a
                        href="/Signin"
                        className="font-medium text-blue-500 hover:underline"
                      >
                        Login here
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

export default Signup;