import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { UserType } from "../context/UserContext";
import { CgSpinner } from "react-icons/cg";

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [errors, setErrors] = useState('')
  const { setUser, setUserEmail } = UserType();
  const [loading, setLoading] = useState(false)

  const {createUser} = UserAuth()
  const navigate = useNavigate()

  const handleConfirmPasswordChange = () => {
    console.log(password)
    console.log(confirmPassword)
    if(password !== confirmPassword){
      setErrors('Passwords do not match')
      setPasswordMatch(false)
    }else{
      setPasswordMatch(true)
      setErrors('')
    }
  }

  const handleSubmit = async (e) => {
    //Doesn't let the page reload
    console.log("Reached here")
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrors('Passwords do not match')
      setPasswordMatch(false)
    } else {
      setErrors('')
      setPasswordMatch(true)
      if (!email) {
        setErrors({ email: "Email is required" });
        return;
      }
      if (!password) {
        setErrors({ password: "Password is required" });
        return;
      }
      setLoading(true)
      try{
        console.log("Reached here")
        await createUser(email, password)
        //Only students are able to create an account
        setUser("student")
        console.log(email);
        setUserEmail(email)
        navigate("/createStudent")
      }catch(e){
        setErrors("Sign Up failed. Please try again")
        console.log(e.message)
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
       <div className="md:w-1/2 h-full">
        <img src="./login_bg.png" alt="SignUp Image" className="h-full w-full object-fit-cover" />
      </div>
      <div className="md:w-1/2 h-screen flex flex-col items-center justify-center bg-[#FFF0DF]">
        <h1 className="text-3xl mb-4 font-bold text-center">Create your account!</h1>
        <form 
          className="bg-[#FFF0DF] p-10 border-0 w-full md:w-2/3 lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            <input
              className={`${
                errors.email
                  ? "border-red-500"
                  : "border-black"
              }
              w-full border-0 focus:border-0 bg-transparent text-black border-b focus:border-b focus:border-black`}
              id="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <input
              className={`${
                errors.password
                  ? "border-red-500"
                  : "border-black"
              }
              w-full border-0 focus:border-0 bg-transparent text-black border-b focus:border-b focus:border-black`}
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}

          </div>
          <div className="mb-6">
            <input
              className="w-full border-0 focus:border-0 bg-transparent text-black border-b focus:border-b border-black focus:border-black"
              id="confirm-password"
              type="password"
              placeholder="Re-type Password"
              onChange={(e) => {setConfirmPassword(e.target.value); setPasswordMatch(true)}}
              onBlur={handleConfirmPasswordChange}
              style={{ boxShadow: 'none' }}
            />
            {passwordMatch ? null : <p className="text-red-500 text-sm">Passwords do not match</p>}
          </div>
          <button
            className="bg-[#060606] hover:bg-[#343332] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            {loading ? (
                <CgSpinner size={35} className="animate-spin mx-auto" />
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>
        <p className="text-center text-gray-700 mt-8">
          Already have an account?{' '}
          <Link to='/login' className='text-black hover:underline underline-offset-2 font-semibold'>
             Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
