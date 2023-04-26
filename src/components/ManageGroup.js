import React,{useState, useEffect} from 'react'
import closeIcon from "../assets/closeIcon.png"
import { protectedRequest } from '../requestMethods';
import { ChatState } from '../Context/AppContext'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function ManageGroup({closePopup,data}) {
    const {setSelectedChat,user}=ChatState()
    const [groupName,setGroupName]=useState(data&&data.chatName)
    const [searchKey, setSearchKey]=useState("")
    const [searchResult, setSearchResult]=useState()
    const [loaderOne, setloaderOne]=useState(false)
    const [loaderTwo, setloaderTwo]=useState(false)
    const [loaderThree, setloaderThree]=useState(false)


    const handleNameChange=(event)=>{
        setGroupName(event.target.value)
    }

    
  const searchHandler=(e)=>{
    e.preventDefault();
    setSearchKey(e.target.value);
  }


    useEffect(()=>{
        const delayDebounceFn=setTimeout(()=>{
        if(searchKey){
          protectedRequest.get(`/auth/search/${searchKey}`)
          .then(response=>{
            setSearchResult(response.data?.user);
            // console.log("search user",searchResult);
          })
          .catch(error=>{
            console.log(error);
          })
        }
        },700);
    
        return ()=>clearTimeout(delayDebounceFn);
      },[searchKey]);

      const removeUserHandler=(id)=>{
       if(data.groupAdmin?._id===user.user?._id){
        if(!loaderOne){
          setloaderOne(true)
          protectedRequest.put("/chat/removeFromGroup",{chatId: data&& data._id, userId: id})
          .then(Response=>{
              setSelectedChat(Response.data);
              setloaderOne(false)
          }).catch(error=>{
              console.log(error);
              setloaderOne(false);
          })
      }
       }
       else{
        toast.error("Only Admin can remove members", {
          position: toast.POSITION.TOP_RIGHT
        });
       }
      }

      const addUserHandler=(id)=>{
        if(data.groupAdmin?._id===user.user?._id){
          if(!loaderTwo){
            if(data&& data.users.some(obj => obj._id === id))
            {
                toast.warn("User is Already Member", {
                  position: toast.POSITION.TOP_RIGHT
                });
                return;
            }
            setloaderTwo(true)
            protectedRequest.put("/chat/addToGroup",{chatId: data&& data._id, userId: id})
            .then(Response=>{
                setSelectedChat(Response.data);
                setloaderTwo(false)
            }).catch(error=>{
                console.log(error);
                setloaderTwo(false);
            })
        }
        }
        else{
            toast.error("Only Admin can add members", {
              position: toast.POSITION.TOP_RIGHT
            });
        }
      }

      const groupRenameHandler=()=>{
        if(data.groupAdmin?._id===user.user?._id){
          if(!loaderThree){
            if(!(data && data.chatName===groupName)){
                setloaderThree(true)
                protectedRequest.put("/chat/renameGroup",{chatId: data&& data._id, chatName: groupName})
                .then(response=>{
                    toast.success("Group Name updated successfully", {
                      position: toast.POSITION.TOP_RIGHT
                    });
                    setSelectedChat(response.data);
                    setloaderThree(false)
                })
                .catch(error=>{
                    console.log(error);
                    setloaderThree(false);
                })
            }
        }
        }
        else{
          toast.error("Only Admin can change group name", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }


  return (
    <div className=" absolute left-0 right-0  flex items-center h-full w-full justify-center ">
<div className="max-w-xs ">
    <div className="bg-white shadow-xl rounded-lg py-3 w-72 ">
       <div className='flex flex-row items-center justify-between px-3 py-1 border-b border-gray-300 '>
          <h2 className='font-bold'>Manage Group</h2>
          <img onClick={closePopup}  className='w-6 cursor-pointer' src={closeIcon} alt='close-btn'/>
        </div>
        <div className='flex flex-row items-start px-3 gap-2 mt-4'>
         <input className='w-full border-2 border-gray-300 pl-3 py-1 rounded-lg' value={groupName} type='text'  onChange={handleNameChange}  />
         <button onClick={groupRenameHandler} className='px-3 py-1 bg-[#228b22] rounded-lg text-white'>Update</button>
         </div>
         <div className='text-xm px-3 flex items-start mt-3 mb-2 font-bold'>Group Members</div>
         <div className='w-full  h-32 overflow-y-auto bg-[#EEEFEF]'>
        {
           data && data.users.map((user,index)=>(
                <div onClick={removeUserHandler.bind(this,user._id)} key={index} className=' bg-white flex flex-row justify-between gap-3 items-center  px-3 py-1'>
              <img className='w-8 h-8 rounded-full' src={user.profilePicture} alt='user list'/>
              <div className='flex flex-col items-start'>
                 <h3 className='text-[12px] font-bold'>{user.name}</h3>
                 <p className='text-[10px]'>{user.email}</p>
              </div>
              <button className='px-3 py-1 bg-[#E21717] rounded-lg text-white'>Remove</button>
            </div>
            ))
        }
         </div>
         <div className='text-xm px-3 flex items-start mt-3 mb-2 font-bold'>Add New Members</div>
         <div className='px-3'><input onChange={searchHandler} name={searchKey} className='w-full border-2 border-gray-300 pl-3 py-1 rounded-lg' type='text' placeholder='Add Users..'/></div>
         <div className='w-full px-3 py-1 h-20 overflow-y-auto '>
         {
           searchResult && searchResult.map((user,index)=>(
            <div  key={index} className='flex flex-row justify-between px-3 gap-3 items-center  py-1'>   
              <img className='w-8 h-8 rounded-full' src={user.profilePicture} alt='user list'/>
              <div className='flex flex-col items-start'>
                 <h3 className='text-[12px] font-bold'>{user.name}</h3>
                 <p className='text-[10px]'>{user.email}</p>
              </div>
              <button onClick={addUserHandler.bind(this,user._id)} className='px-3 py-1 bg-[#228b22] rounded-lg text-white'>Add</button>
            </div>
           ))
         }
         </div>
    </div>
</div>
<ToastContainer/>
</div>
  )
}

export default ManageGroup