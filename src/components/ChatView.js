import React,{useEffect,useState,useRef} from 'react'
import userprofile from '../assets/userprofile.png'
import { ChatState } from '../Context/AppContext'
import { protectedRequest } from '../requestMethods'
import { getSender, getSenderImage } from '../Config/ChatLogic'
import ProfileModel from './ProfileModel'
import io from "socket.io-client"
import ManageGroup from './ManageGroup'

const ENDPOINT="http://3.110.132.39:5000"
let socket, selectedChatCompare;

function ChatView() {
    const {selectedChat,setSelectedChat,notification, setNotification, user}=ChatState()
    const [chatData, setChatData]=useState([])
    const [profileFlag, setProfileFlag]=useState(false)
    const [newMessage, setNewMessage]=useState("")
    const [socketConnected, setsocketConnected]=useState(false)
    const [typing, setTyping]=useState(false)
    const [isTyping, setIsTyping]=useState(false)
    const [groupSettingFlag, setGroupSettingFlag]=useState(false)
    const messageListRef = useRef(null);



    useEffect(()=>{
     if(selectedChat){
      if(selectedChat.email){
        protectedRequest.post("/chat/accessChat",{userId: selectedChat._id})
        .then(response=>{
          // console.log("resp",response);
          setSelectedChat(response.data)
        })
        .catch(error=>{
          console.log(error);
        })
      }
      selectedChatCompare=selectedChat && selectedChat;
      protectedRequest.get(`/message/getAllMessages/${selectedChat._id}`)
      .then(response=>{
         const {data}=response
        //  console.log(response);
         setChatData(data)
         socket.emit("join room",selectedChat._id)
      }).catch(error=>{
         console.log(error);
      })
     }
    },[selectedChat,setSelectedChat]);


     useEffect(()=>{
    socket=io(ENDPOINT);
    // console.log("socio",user);
    socket.emit("setup", user)
    socket.on("connected",()=>setsocketConnected(true));
    socket.on("typing",()=>setIsTyping(true));
    socket.on("typing stopped", ()=>setIsTyping(false));
   },[user])

  //  console.log("notification",notification);
    
   useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat?._id){
        // notification logic

        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...notification])
        }
        
      }
      else{
        setChatData([...chatData, newMessageRecieved]);
      }
    })
    
   },[chatData,setChatData,selectedChat,notification,setNotification,newMessage])
 
    const popUpHandler=()=>{
      if(profileFlag){
        setProfileFlag(false);
      }
      else{
        setProfileFlag(true);
      }
    }

    const closePopup=()=>{
      if(groupSettingFlag){
        setGroupSettingFlag(false)
      }
      else{
        setGroupSettingFlag(true)
      }
    }

    const messageHandler=(event)=>{
      event.preventDefault();
      setNewMessage(event.target.value);
      // typing indicater logic
      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime=new Date().getTime();
      let timerLength=3000;
      setTimeout(()=>{
        let timeNow=new Date().getTime();
        let timeDifference=timeNow-lastTypingTime;
        if(timeDifference>=timerLength && typing)
        {
          socket.emit("typing stopped", selectedChat._id);
          setTyping(false);
        }
        
      },timerLength);
    }

    const sendMessage=(event)=>{
      if(event.key==="Enter" && newMessage ){
        event.preventDefault();
        socket.emit("typing stopped",selectedChat._id)
        // console.log("msg", newMessage);
        protectedRequest.post("/message/sendMessage",{content: newMessage, chatId: selectedChat._id})
        .then(response=>{
          setNewMessage("")
          setChatData([...chatData,response.data])
          socket.emit("new message",response.data);
        })
        .catch(error=>{
          console.log(error);
        })
      }
    }

    
    useEffect(() => {
        const messageList = messageListRef.current;
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight; // set scrollbar to bottom initially
    
          // whenever a new message is added, set scrollbar to bottom again
          const observer = new MutationObserver(() => {
            messageList.scrollTop = messageList.scrollHeight;
          });
          observer.observe(messageList, { childList: true });
    
          return () => observer.disconnect();
        }
    }, [chatData]);
  

    if(!selectedChat){
      <div className='bg-[#EEEFEF] w-3/4 h-screen rounded-t'>

      </div>
    }

    if(selectedChat && selectedChat)
    {
  return (
    <div className='bg-[#EEEFEF] w-4/6 h-screen rounded-t'>
          {profileFlag && profileFlag?  <ProfileModel closePopup={popUpHandler} data={selectedChat}/>: ""}
          {groupSettingFlag && groupSettingFlag? <ManageGroup closePopup={closePopup} data={selectedChat&& selectedChat}/>: ""}
      <div className='w-full flex flex-row  items-center justify-between bg-[#FFF] p-2'>
         <div className='flex flex-row gap-4 items-center'>
         <div onClick={popUpHandler} className='cursor-pointer'>
                <img className='w-10 h-10  rounded-full' src={(selectedChat && selectedChat.isGroupChat)? userprofile : selectedChat.email? selectedChat.profilePicture : getSenderImage(user && user ,selectedChat && selectedChat.users)} alt='user-profile'/>
          </div>
        <div>
        <h2 className='font-xl font-bold'>{(selectedChat && selectedChat.isGroupChat)? selectedChat.chatName : selectedChat.email? selectedChat.name: getSender(user && user ,selectedChat && selectedChat.users)}</h2>
        {isTyping? <p className='text-xs font-bold text-gray-400'>{(selectedChat && selectedChat.isGroupChat)? "Some is typing..": "Typing..."}</p>: ""}
        </div>
         </div>
         <div>
         {(selectedChat && selectedChat.isGroupChat)?<div onClick={closePopup} className='px-3 py-1 bg-[#228b22] rounded-lg cursor-pointer'>
          <h3 className='text-white text-xm'>Manage</h3>
          </div>: ""}
         </div>
      </div>
      {/* messages */}
      <div ref={messageListRef} className='flex flex-col w-full h-4/5 overflow-y-auto'>
      {
        chatData && chatData.map((data,index)=>(
         (user && user.user._id===data.sender?._id)? <div key={index} className='flex justify-end p-2 w-full '>
        <div className='bg-[#98fb98] shadow rounded-xl px-4 py-2' >{data.content}</div>
     </div>: selectedChat&& selectedChat.isGroupChat? <div key={index}  className='flex flex-row items-start gap-1 p-2'>
           <img src={data.sender?.profilePicture} alt='sender dp' className='w-6 h-6 object-scale-down rounded-full'/>
           <div className='flex flex-col items-start bg-white shadow rounded-xl px-4 py-2'>
             <p className='text-xs  text-green-500 font-bold'>{data.sender?.name}</p>
             <h3>{data.content}</h3>
            </div>
        </div> : <div key={index} className='flex items-start p-2'>
        <div className='bg-white shadow rounded-xl px-4 py-2'>{data.content}</div>
     </div>
        ))
      }
      </div>
      {/* message bar onChange={messageHandler} */}
      <div className='w-full flex pt-2 justify-center'>
        <div className='flex flex-row items-center w-4/5 '>
        <input onKeyDown={sendMessage} onChange={messageHandler}  placeholder='Type your message....' type='text' value={newMessage} className='bg-white w-full pl-2 h-8 rounded-xl'/>
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 ml-4 ">
             <svg className="w-5 h-5 transform rotate-90 -mr-px"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
        </div>
      </div>
    </div>
  )
    }
}

export default ChatView