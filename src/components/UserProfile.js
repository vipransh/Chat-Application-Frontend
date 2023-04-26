import React from 'react'
import closeIcon from "../assets/closeIcon.png"

function UserProfile({closePopup,data}) {
  return (
    <div className="absolute left-0 right-0  flex items-center h-full w-full justify-center ">
<div className="max-w-xs ">
    <div className="bg-white shadow-xl rounded-lg py-3 w-64 ">
       <div className='flex items-center justify-end pr-4 '>
       <img onClick={closePopup}  className='w-8 cursor-pointer' src={closeIcon} alt='close-btn'/>
       </div>
        <div className="photo-wrapper p-2">
            <img className="w-32 h-32 object-scale-down rounded-full mx-auto" src={data.profilePicture} alt="user profile"/>
        </div>
        <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{data.name}</h3>
            
            <table className="text-xs my-3">
                <tbody>
                <tr>
                    <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                    <td className="px-2 py-2">{data.email}</td>
                </tr>
            </tbody></table>
        </div>
    </div>
</div>
</div>
  )
}

export default UserProfile