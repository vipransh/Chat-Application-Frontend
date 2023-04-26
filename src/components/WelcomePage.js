import React from 'react'
import { ChatState } from '../Context/AppContext'

function WelcomePage() {
    const {user}=ChatState()
  return (
    <div className=' flex items-center justify-center bg-white w-4/6 h-screen rounded-t'>
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col items-center gap-4'>
                <img className='w-24 h-24 rounded-full' src={user&& user.user.profilePicture} alt='profile'/>
                <h1 className='font-bold'>Welcome {user&& user.user.name}</h1>
            </div>
            <p className='text-xs'>Please select a chat to start messaging</p>
        </div>
    </div>
  )
}

export default WelcomePage