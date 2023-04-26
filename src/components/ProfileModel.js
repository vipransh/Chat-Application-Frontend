import React from 'react'
import closeIcon from "../assets/closeIcon.png"
import { ChatState } from '../Context/AppContext'
import { getSender, getSenderImage, getEmail } from '../Config/ChatLogic'



function ProfileModel({closePopup,data}) {
  const {user}=ChatState()
  return (
<div className="absolute left-0 right-0  flex items-center h-full w-full justify-center ">
<div className="max-w-xs ">
    <div className="bg-white shadow-xl rounded-lg py-3 w-64 ">
       <div className='flex items-center justify-end pr-4 '>
       <img onClick={closePopup}  className='w-8 cursor-pointer' src={closeIcon} alt='close-btn'/>
       </div>
       {data.isGroupChat? "" : <div className="photo-wrapper p-2">
            <img className="w-32 h-32 object-scale-down rounded-full mx-auto" src={getSenderImage(user && user, data.users)} alt="user profile"/>
        </div> }
        <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{data.isGroupChat? data.chatName: getSender(user && user,data.users)}</h3>
            
            <table className="text-xs my-3">
                <tbody>
                {
                    data.isGroupChat? <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Members</td>
                    </tr>: ""  
                }
                {data.isGroupChat? data.users.map((user,index)=>(
                    <tr key={index}>
                    <td className='py-2'><img className='w-5 h-5 object-scale-down rounded-full' src={user.profilePicture} alt='user pic'/></td>
                    <td className="py-2">{user.email} {data.groupAdmin._id===user._id? <h3 className='bg-[#98fb98] rounded-xl'>Group Admin</h3>: ""} </td>
                </tr>
                )) :  <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                    <td className="px-2 py-2">{getEmail(user,data.users)}</td>
                </tr>}
            </tbody></table>
        </div>
    </div>
</div>
</div>
  )
}

export default ProfileModel