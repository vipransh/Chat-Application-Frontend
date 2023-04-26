import React,{useState} from 'react'
import bgimg from '../assets/bgimg.svg'
import logoimg from '../assets/logoimg.png'
import { useNavigate } from 'react-router-dom'
import { signUpRequest } from '../requestMethods'
import Loader from './Loader'
import { refreshToken } from '../requestMethods'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



function Signup() {
    const navigate=useNavigate();
    const [imageSrc,setImageSrc]=useState()
    const [loading, setLoading]=useState(false)
    const [values, setValues]=useState({
        name: "",
        email: "",
        password: "",
        image: "",
      })


    const handleImages=(e)=>{
        e.preventDefault();
        setValues({
            ...values,
            image : e.target.files[0]
          });
        setImageSrc(URL.createObjectURL(e.target.files[0]));
      }
    
     const handleSignUp=()=>{
       if(!loading){
        if(!(values.name && values.email && values.password && values.image)){
            // window.alert("please fill all the feilds");
            toast.warn("Please fill all feilds !", {
              position: toast.POSITION.TOP_RIGHT
            });
        }
        else{
            setLoading(true)
            signUpRequest.post("/auth/register",values)
            .then(response=>{
                // console.log(response)
                const {data}=response
                if(data.success===true){
                    refreshToken();
                    navigate("/signup")
                    window.location.reload()
                }
                setLoading(false)
            })
            .catch(error=>{
                setLoading(false)
                console.log(error)
            })
        }
       }
     } 
  return (
    <div className=' w-full h-auto'>
    <img className='w-full h-screen z-0' src={bgimg} alt='background svg'/>
    <div className="absolute flex justify-center top-[10px] w-full ">
      <div>
      <section className="bg-gray-50 dark:bg-gray-900 ">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div  className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-48 mr-2" src={logoimg} alt="logo"/>
      </div>
      <div className="w-96 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create New Account
              </h1>
              <div className='flex flex-col items-center'>
                <div><img className='w-24 h-24  rounded-full' src={imageSrc} alt="profile"/></div>
                <input onChange={handleImages} type='file'  accept="image/*"/>
              </div>
              <div className="space-y-4 md:space-y-6">
                  <div>
                      <label htmlFor="email" className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your name" required="" onChange={(e)=>setValues({
                        ...values,
                        name: e.target.value
                      })} />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="abcd@email.com" required="" onChange={(e)=>setValues({
                        ...values,
                        email: e.target.value
                      })} />
                  </div>
                  <div>
                      <label htmlFor="password" className="block text-start mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e)=>setValues({
                        ...values,
                        password: e.target.value
                      })} />
                  </div>
                  <button onClick={handleSignUp} type="submit" className="w-full text-white bg-[#22CB5C] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading? <Loader/>: "Sign Up"}</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">SignIn</a>
                  </p>
              </div>
          </div>
      </div>
  </div>
</section>
      </div>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default Signup