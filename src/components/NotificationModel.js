import React from 'react'
import closeIcon from "../assets/closeIcon.png"
import userprofile from '../assets/userprofile.png'
import { ChatState } from '../Context/AppContext'

function NotificationModel({closePopup}) {
    const {notification, setSelectedChat, setNotification}=ChatState();

    const viewNotification=(data)=>{
        setSelectedChat(data.chat)
        setNotification(notification.filter((element)=>element._id!==data._id))
    }

    if(notification && notification.length===0){
        return(
            <div className='absolute left-14 w-1/5 top-1 z-10 h-auto  bg-white shadow-xl rounded-lg py-2'>
        <div className='flex flex-row items-center justify-between px-3 py-1 border-b border-gray-300 '>
          <h2 className='font-bold'>Notification</h2>
          <img onClick={closePopup}  className='w-6 cursor-pointer' src={closeIcon} alt='close-btn'/>
        </div>
        <div className='pt-0 px-3 py-1'>
          <p className='text-xm font-bold'>No new notifications</p>
        </div>
    </div>
        )
    }
  return (
    <div className='absolute left-14 w-1/5 top-1 z-10 h-auto  bg-white shadow-xl rounded-lg py-2'>
        <div className='flex flex-row items-center justify-between px-3 py-1 border-b border-gray-300 '>
          <h2 className='font-bold'>Notification</h2>
          <img onClick={closePopup}  className='w-6 cursor-pointer' src={closeIcon} alt='close-btn'/>
        </div>
        <div className='pt-0'>
           {
            notification && notification.map((data,index)=>(
                <div onClick={viewNotification.bind(this,data)} key={index} className='px-3 py-1  bg-white rounded-sm cursor-pointer '>
                <div className='flex flex-row gap-2'>
                <img className='w-6 h-6 rounded-full object-scale-down' src={data.chat?.isGroupChat? userprofile: data.sender?.profilePicture} alt="DP"/>
                <h3 className='text-xm'>{data.chat?.isGroupChat? data.chat?.chatName: data.sender?.name}</h3>
                </div> 
                <div className='flex items-start ml-8'>
                    <p className='text-xs' >{data.content}</p>
                </div>     
            </div>
            ))
           }
        </div>
    </div>
  )
}

export default NotificationModel