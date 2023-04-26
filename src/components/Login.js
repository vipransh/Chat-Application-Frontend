import React,{useState} from 'react'
import bgimg from '../assets/bgimg.svg'
import logoimg from '../assets/logoimg.png'
import { useNavigate } from 'react-router-dom'
import { publicRequest } from '../requestMethods'
import { Link } from 'react-router-dom'
import { refreshToken } from '../requestMethods'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


import Loader from './Loader'

function Login() {
    const [email, setEmail]=useState()
    const [password, setPassword]=useState()
    const [loading, setLoading]=useState(false)
    const navigate=useNavigate();

  

    const clickHandler=(e)=>{
        e.preventDefault();
        if(!(email && password))
        {
            toast.warn("Please fill all feilds !", {
              position: toast.POSITION.TOP_RIGHT
            });
            setLoading(false)
            return;
        }

        try {
            setLoading(true)
            
              publicRequest.post('/auth/login',{ email: email,password: password })
              .then(response => {
                const {data}=response
                if(data.success)
               {
                localStorage.setItem("userInfo", JSON.stringify(data));
                refreshToken()
                navigate("/")
                window.location.reload();
               }
              })
              .catch(error => {
                if (error.response && error.response.status === 401) {
                  // handle 401 error
                  toast.error("Invalid email or password !", {
                    position: toast.POSITION.TOP_RIGHT
                  });
                  setLoading(false)
                } else {
                  // handle other errors
                  console.error(error);
                  setLoading(false)
                }
              });    
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className=' w-full h-full'>
     <ToastContainer/>
    <img className='w-full h-screen z-0' src={bgimg} alt='background svg'/>
    <div className="absolute flex justify-center top-0 w-full ">
      <div>
      <section className="bg-gray-50 dark:bg-gray-900 ">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div  className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-48 mr-2" src={logoimg} alt="logo"/>
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label htmlFor="email" className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" 
                        onChange={(e)=>setEmail(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""
                        onChange={(e)=>setPassword(e.target.value)}
                      />
                  </div>
                  <button type="submit" className="w-full text-white bg-[#22CB5C] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={clickHandler} >{loading? 
                 <Loader/>
                :"Sign in"}</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/signup"  className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
      </div>
    </div>
    </div>
  )
}

export default Login