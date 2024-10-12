import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserAuth } from '../../context/AuthContext'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [error, setError] = useState('')

  const {createUser} = UserAuth()
  const navigate = useNavigate()

  const handleConfirmPasswordChange = () => {
    console.log(password)
    console.log(confirmPassword)
    if(password !== confirmPassword){
      setError('Passwords do not match')
      setPasswordMatch(false)
    }else{
      setPasswordMatch(true)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    //Doesn't let the page reload
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setPasswordMatch(false)
    } else {
      setError('')
      setPasswordMatch(true)
      try{
        await createUser(email, password)
        navigate("/account")

      }catch(e){
        setError(e.message)
        console.log(e.message)

      }
    }
  }

  return (
    <div className='max-w-[700px] mx-auto my-16 p-4'>
      <div>
        <h1 className='text-2xl font-bold py-2'>
          Create your account!
        </h1>
        <p className='py-2'>
          Already have an account?  
          <Link to='/' className='underline mx-2'>
             Sign In.
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col py-2'>
          <label className='py-2 font-medium'>Email Address</label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type='email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='flex flex-col py-2'>
          <label className='py-2 font-medium'>Password</label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='flex flex-col py-2'>
          <label className='py-2 font-medium'>Confirm Password</label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordChange}
          />
          {passwordMatch ? null : <p className="text-red-500 text-sm">Passwords do not match</p>}
        </div>
        <button 
          className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white font-bold'
          disabled={!passwordMatch}
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUp