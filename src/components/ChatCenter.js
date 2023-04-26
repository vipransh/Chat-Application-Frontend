import React,{useEffect,useState} from 'react'
import logoimg from '../assets/logoimg.png'
import ChatList from './ChatList'
import ChatView from './ChatView'
import SideNavbar from './SideNavbar'
import { protectedRequest } from '../requestMethods'
import { ChatState } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'
import WelcomePage from './WelcomePage'



function ChatCenter() {
  const {setChats, searchFlag, setSearchFlag, selectedChat}=ChatState()
  const [searchKey, setSearchKey]=useState("")
  const navigate=useNavigate();

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    if(!userInfo)
    navigate("/")
   },[navigate])

  useEffect(()=>{
    const delayDebounceFn = setTimeout(() => {
      if (searchKey.length > 0 && searchFlag) {
        protectedRequest
          .get(`/auth/search/${searchKey}`)
          .then((response) => {
            setChats(response.data?.user);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (searchKey.length === 0) {
        protectedRequest("/chat/fetchChats")
          .then((response) => {
            const { data } = response;
            setChats(data);
            setSearchFlag(false)
            // console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 700);
  
    return () => clearTimeout(delayDebounceFn);
  },[setChats, searchKey,searchFlag,setSearchFlag]);

    
  const searchHandler=(e)=>{
    e.preventDefault();
    if((e.target.value).length<1)
    {
      setSearchFlag(false)
    }
    setSearchKey(e.target.value);
    setSearchFlag(true)
  }


  return (
    <div className='flex flex-row w-full h-screen bg-[#9DA4A8] '>
    {/* left panel */}
    <div className='flex flex-row w-2/6 h-screen bg-[#FFF] rounded-t mr-1'>
    <SideNavbar/>
    <div className='flex flex-col w-full h-full'>
        {/* top section*/}
        <div className='p-1  border-b border-gray-300'>
            <div className='flex items-center justify-center'>
            <img className="w-36" src={logoimg} alt="logo"/>
            </div>
        </div>
        {/* search section */}
        <div className='p-2'>
        <div className='flex flex-row items-center bg-[#EEEFEF]'>
          <input onChange={searchHandler} type='text' className='w-full h-8 border-none  bg-[#EEEFEF] pl-2' placeholder='Search...'/>
          <div  className="flex items-center justify-center h-7 w-7  text-gray-500 ">
          <svg className="w-4 h-4 stroke-current"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        </div>
        </div>
       
        {/* user lists */}
        <ChatList/>
    </div>
    </div>
    {/* right panel */}
    {selectedChat&& selectedChat? <ChatView/>: <WelcomePage/>}
    </div>
  )
}

export default ChatCenter