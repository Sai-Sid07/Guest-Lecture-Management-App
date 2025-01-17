import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

//Account will ask additional params for students and store it in mongodb


const Account = () => {
  const {user, logout} = UserAuth();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try{
      await logout()
      navigate("/")
      console.log("You are logged out")
    }catch(e){
      console.log(e.message)
    }
  }
  return (
    <div className='max-w-[700px] mx-auto my-16 p-4'>
      <h1 className='text-2xl font-bold py-4'>Account</h1>
      <p>User Email:{user && user.email} </p>
      <button 
      className='border px-6 py-2 my-4'
      onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default Account