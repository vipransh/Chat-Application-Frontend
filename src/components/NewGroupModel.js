import React,{useEffect, useState} from 'react'
import closeIcon from "../assets/closeIcon.png"
import { protectedRequest } from '../requestMethods'
import Loader from './Loader'
import { ChatState } from '../Context/AppContext'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function NewGroupModel({closePopup}) {
  const { setChats}=ChatState()
  const [groupMembers,setGroupMembers]=useState([])
 const [searchKey, setSearchKey]=useState("")
 const [searchResult, setSearchResult]=useState();
 const [groupName, setGroupName]=useState()
 const [loading,setLoading]=useState(false)


  const addToMemberList=async(data)=>{
    setGroupMembers([...groupMembers,data])
     
  }

  const removeFromMemberList=(id)=>{
    setGroupMembers(groupMembers.filter((data)=>data._id!==id))
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


  const searchHandler=(e)=>{
    e.preventDefault();
    setSearchKey(e.target.value);
  }

  const CreateNewGroup=(e)=>{

    if(loading)
    {
      return
    }

    if(!groupName){
      toast.warn("Group Name is required !", {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }

    if(groupMembers.length<1)
    {
     toast.warn("Minimum 2 group members are required", {
      position: toast.POSITION.TOP_RIGHT
    });
     setLoading(false)
    }
   else{
    setLoading(true)
    e.preventDefault();
    const users=[]
    groupMembers.map((data)=>(
      users.push(data._id)
    ))
    const stringifyList=JSON.stringify(users)
    protectedRequest.post("/chat/createGroup",{name: groupName, users: stringifyList})
    .then(response=>{
      if(response.status===200){
        toast.success("New Group Created Successfully", {
          position: toast.POSITION.TOP_RIGHT
        });
        fetchChats();
        closePopup();
      }
      setLoading(false);
    })
    .catch(error=>{
      console.log(error);
      setLoading(false)
    })
   }
  }

  const fetchChats=()=>{
    protectedRequest("/chat/fetchChats")
        .then(response=>{
            const {data}=response
            setChats(data)
            // console.log(response);
        }).catch(error=>{
            console.log(error);
        })
  }
  

  return (
    <div className="absolute left-0 right-0  flex items-center h-full w-full justify-center ">
      <div className="max-w-xs ">
         <div className="bg-white shadow-xl rounded-lg py-3 w-64 h-96 ">
         <div className='flex flex-row items-center justify-between px-3 py-1 border-b border-gray-300 '>
         <h2 className='font-bold'>Create New Group</h2>
          <img onClick={closePopup}  className='w-6 cursor-pointer' src={closeIcon} alt='close-btn'/>
          </div>
         <div className='flex flex-col items-start px-3 gap-2 mt-4'>
         <label className='text-xm'>Group Name</label>
         <input className='w-full border-2 border-gray-300 pl-3 py-1 rounded-lg' type='text' placeholder='Group Name..' onChange={(e)=>{setGroupName(e.target.value)}} />
         </div>
         <div className='flex items-center justify-start px-3 mt-3'>
          <label className='text-xm'>Group Members</label>
         </div>
         
         <div className='w-full h-40 flex flex-col gap-2 px-3  overflow-y-auto'>
         <div className='flex flex-row flex-wrap gap-2 px-3 py-1'>
          {
            groupMembers && groupMembers.map((data,index)=>(
              <div key={index} className='flex flex-row items-center gap-1 bg-slate-300'>
                <p>{data.name}</p>
                <img onClick={removeFromMemberList.bind(this,data._id)}  className='w-4 cursor-pointer' src={closeIcon} alt='close-btn'/>
              </div>
            ))
          }
         </div>
         <input onChange={searchHandler} name={searchKey} className='w-full border-2 border-gray-300 pl-3 py-1 rounded-lg' type='text' placeholder='Add Users..'/>
         {
           searchResult && searchResult.map((data,index)=>(
            <div onClick={addToMemberList.bind(this,data)} key={index} className='flex flex-row gap-3 items-center cursor-pointer'>
              <img className='w-8 h-8 rounded-full' src={data.profilePicture} alt='user list'/>
              <div className='flex flex-col items-start'>
                 <h3 className='text-[12px] font-bold'>{data.name}</h3>
                 <p className='text-[10px]'>{data.email}</p>
              </div>
            </div>
           ))
         }
         </div>
         <div className='px-3 flex items-center justify-end py-1'>
         <button onClick={CreateNewGroup} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br  font-medium rounded-lg text-sm px-4 py-2 text-center">{loading? <Loader/> : "Create Group"}</button>
         </div>
          </div>
       </div>
       <ToastContainer/>
    </div>
  )
}

export default NewGroupModel