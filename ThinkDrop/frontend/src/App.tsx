
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './Components/Signup'
import Signin from './Components/Signin'
import Dashboard from './Components/Dashboard'
import { Toaster } from 'react-hot-toast';
import Blog from './Components/Blog'
import UploadBlog from './Components/UploadBlog';
import Myblogs from './Components/Myblogs';

const App = () => {
  return (
     <div>
             <Toaster position="top-center" reverseOrder={false} />
             <BrowserRouter>
                 <Routes>
                     <Route path='/' element={<Signup/>} />
                     <Route path='/signin' element={<Signin/>} />
                     <Route path='/dashboard' element={<Dashboard/>}/>
                     <Route path='/blog' element={<Blog/>} />
                     <Route path='/uploadblog' element={<UploadBlog/>} />
                     <Route path='/myblogs' element={<Myblogs/>} />
                 </Routes>
             </BrowserRouter>
     </div>
  )
}

export default App