import React,{createContext, useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";



const chatContext=createContext();





const AppContext=({children})=>{
    const [selectedChat, setSelectedChat]=useState()
    const [user,setUser]=useState()
    const [chats,setChats]=useState()
    const [notification, setNotification] = useState([]);
    const [searchFlag, setSearchFlag]=useState(false);
   
    
    const navigate=useNavigate()
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
       if(userInfo){
        navigate("/chatCenter")
       }
    },[navigate]);

   
   

    return (
        <chatContext.Provider value={{
            user, 
            setUser,
            selectedChat,
            setSelectedChat,
            chats,
            setChats,
            notification, 
            setNotification,
            searchFlag, setSearchFlag
            }}>
            {children}
        </chatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(chatContext);
  };


export default AppContext;
