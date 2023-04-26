import React,{useState} from 'react'
import { ChatState } from '../Context/AppContext'
import plusicon from '../assets/plusicon.png'
import NewGroupModel from './NewGroupModel'
import NotificationModel from './NotificationModel'
import UserProfile from './UserProfile'

function SideNavbar() {
    const {user,notification}=ChatState()
    const [popUpFlag, setPopUpFlag]=useState(false)
    const [notifyFlag, setNotifyFlag]=useState(false)
    const [profilePopup,setProfilePopup]=useState(false)

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo")
      window.location.reload();
    }

    const createGroupPopup=()=>{
      if(popUpFlag){
        setPopUpFlag(false)
      }
      else{
        setPopUpFlag(true)
      }
    }

    const notificationPopupHandler=()=>{
      if(notifyFlag){
        setNotifyFlag(false)
      }
      else{
        setNotifyFlag(true)
      }
    }

    const profileHandler=()=>{
      if(profilePopup){
        setProfilePopup(false)
      }
      else{
        setProfilePopup(true)
      }
    }

  return (
    <div className="w-16 h-screen flex flex-col justify-between items-center py-2 border-r border-gray-300">
    {popUpFlag?<NewGroupModel closePopup={createGroupPopup}/>: ""}
    {notifyFlag? <NotificationModel closePopup={notificationPopupHandler}/>:""}
    {profilePopup? <UserProfile closePopup={profileHandler} data={user&& user.user}/>: ""}
     <div className="px-1 ">    
     <img src={user && user.user?.profilePicture} alt='user-profile' className='w-10 h-10 rounded-full ' />
    </div>
    <div className='p-1 flex flex-col items-center gap-4'>
          <button onClick={notificationPopupHandler} className="inline-block relative">
          {notification&& notification.length>0? <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900 ">{notification&& notification.length}</div>: ""}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          <button onClick={createGroupPopup}>
          <img className='w-6' src={plusicon} alt='add group icon'/>
          </button>
         
          <button onClick={profileHandler}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 cursor-pointer text-gray-500 transition-all hover:text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          </button>
    </div>
    <div onClick={logoutHandler} className='mb-5'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 cursor-pointer text-gray-500 hover:text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
    </div>
</div>
  )
}

export default SideNavbar