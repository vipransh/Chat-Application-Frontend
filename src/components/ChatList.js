import React,{useEffect} from 'react'
import userprofile from '../assets/userprofile.png'
import { protectedRequest,refreshToken } from '../requestMethods'
import { getSender,getSenderImage } from '../Config/ChatLogic'
import { ChatState } from '../Context/AppContext'


function ChatList() {

    const {user,chats, setChats,  setSelectedChat,searchFlag}=ChatState()
   
    
    useEffect(()=>{
      refreshToken();
            protectedRequest("/chat/fetchChats")
        .then(response=>{
            const {data}=response
            setChats(data)
            // console.log(response);
        }).catch(error=>{
            console.log(error);
        })
    },[setChats]);

    const clickHandler=(data)=>{
           setSelectedChat(data)
    }

   
      


  return (
      <div className='flex flex-col w-full h-full overflow-y-auto'>
      {
        chats && chats.map((data,index)=>(
            <div onClick={clickHandler.bind(this,data)}  key={index} className='flex flex-row gap-4 items-center p-2  border-b border-gray-300 cursor-pointer'>
            {searchFlag? <div>
                <img className='w-12 h-12 overflow-hidden rounded-full' src={data.profilePicture} alt='user-profile'/>
            </div>: 
            <div>
                <img className='w-12 h-12 overflow-hidden rounded-full' src={data.isGroupChat? userprofile: getSenderImage(user && user, data.users)} alt='user-profile'/>
            </div>}
            {searchFlag? <div className='flex flex-col items-start'>
                <p className='text-sm font-bold'>{data.name}</p>
                <h3 className='text-xs'>{data.email}</h3>
            </div> :
            <div className='flex flex-col items-start'>
                <p className='text-sm font-bold'>{data.isGroupChat? data.chatName: getSender(user, data.users)}</p>
                <h3 className='text-xs'>{data.latestMessage?.content.length>40 ? data.latestMessage?.content.substring(0,40)+"...": data.latestMessage?.content}</h3>
            </div>}
        </div>
       )) 
      }
        </div>
  )
}

export default ChatList