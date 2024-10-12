import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'react-phone-number-input/style.css'
import { UserAuth } from '../context/AuthContext'
import { UserType } from "../context/UserContext";
import PhoneInput from "react-phone-input-2";
import OtpInput from "otp-input-react";
import "./Temp/Stepper.css"
import "react-phone-input-2/lib/style.css";
import { CgSpinner } from "react-icons/cg";

const PhoneSignIn = () => {
    const navigate = useNavigate()
    const {setUpRecaptcha} = UserAuth();
    const [phoneNumber, setPhoneNumber] = useState("")
    const [error, setError] = useState()
    const [message, setMessage] = useState()
    const { setUser, setUserEmail } = UserType();
    const [userData, setUserData] = useState()
    const [showOTP, setShowOTP] = useState(false);
    const [result, setResult] = useState("")
    const [OTP, setOTP] = useState("")
    const [loading, setLoading] = useState(false)
    const [signUp, setSignUp] = useState(false)

    const verifyUser = async () => {
        setLoading(true)
        if(phoneNumber === "" || phoneNumber === undefined){
          return setError("Please enter a valid phone number")
        }

        console.log("Phone number: ", phoneNumber)
        const number = parseInt(phoneNumber.slice(2),10)
        setMessage("")
        setError("")

        console.log("Parsed Number: ",number)
        try{
          const response = await fetch(`http://localhost:5000/api/checkPhoneNumber/${number}`)
          const data = await response.json()
          setUserData(data)
          if(data.phoneNumber == number){
              setMessage("Phone Number verified!")
              setError("")
              console.log("Verified User")
              try{
                const userPhoneNumber = "+" + phoneNumber
                const captchaRequest = await setUpRecaptcha(userPhoneNumber)
                setShowOTP(true)
                setResult(captchaRequest)
                console.log(captchaRequest)
              }catch(error){
                  console.log(error.message)
                  setError(error.message)
              }
          }else{
              setError("Phone number doesn't exist! Please Sign Up!")
              setSignUp(true)
              setMessage("")
              console.log("Failed to verify user")
          }
        }catch(error){
          console.log(error.message)
          setError(error.message)
        }
        setLoading(false)
        setMessage("")
        console.log(phoneNumber)
        //first check if phone number exists in db before sending otp
    }

    const handleSubmit = async(e) => {
      e.preventDefault()
      verifyUser()


    }

    const verifyOTP = async(e) => {
      e.preventDefault()
      setLoading(true)
      console.log(OTP)
      if(OTP === "" || OTP === null){
        return setError("OTP cannot be empty")
      }
      try{
        setError("")
        setMessage("Successfully verified OTP")
        await result.confirm(OTP)
        setUserEmail(userData.email)
        setUser("student")
        navigate("/viewEvents", {
          state:{
            pastEvent: false
          }
        })
      }catch(error){
        setMessage("")
        setError("Invalid OTP")
      }


    }
        
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 h-screen ">
        <img src="./login_bg.png" alt="Login Image" className="h-full w-full object-fit-cover"/>
      </div>
      <div className="md:w-1/2 h-full flex flex-col items-center justify-center bg-[#FFF0DF]">
        {
          showOTP ? (
            <h1 className="text-3xl mb-4 font-bold">Login with Phone</h1>
          ) : (
            <h1 className="text-3xl mb-4 font-bold">Enter OTP</h1>
          )
        }
          <form 
            className="bg-[#FFF0DF] p-10 border-0 w-full md:w-2/3 lg:w-1/2"
            onSubmit={handleSubmit}
          >
          {showOTP ? (
              <>
                <div className='mb-2'>
                  <OtpInput
                    value={OTP}
                    onChange={setOTP}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container"
                  />
                  {message && <p className="text-green-500 font-semibold text-center">{message}</p>}
                  {error && <p className="text-red-500 font-semibold text-center">{error}</p>}
                </div>
                <div className='flex w-full justify-center items-center'>
                  <button
                    // onClick={onOTPVerify}
                    className="bg-[#060606] hover:bg-[#ffffff] text-white hover:text-black font-bold py-2 px-4 mt-7 rounded focus:outline-none focus:shadow-outline w-[75%] flex items-center justify-center"
                    onClick={verifyOTP}
                  >
                    {loading && (
                      <CgSpinner size={25} className="animate-spin mr-3" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <PhoneInput 
                    country='in'
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter Phone number"
                    className='mb-5'
                  />
                  {message && <p className="text-green-500 font-semibold text-center">{message}</p>}
                  {error && <p className="text-red-500 font-semibold text-center">{error}</p>}
                  {!error && <div id="recaptcha-container" className='flex justify-center'/>}
                  <div id="recaptcha-container"></div>
                </div>
                <div className='flex w-full justify-center items-center'>
                  {signUp ? (
                    <Link to="/signup">
                      <button
                        className="bg-[#060606] hover:bg-[#ffffff] text-white hover:text-black font-bold py-2 px-4 mt-7 rounded focus:outline-none focus:shadow-outline"
                        type='submit'
                      >
                        Create Account!
                      </button>
                    </Link>
                  ): (
                    <button
                      className="bg-[#060606] hover:bg-[#ffffff] text-white hover:text-black font-bold py-2 px-4 mt-7 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-[75%]"
                      type='submit'
                    >
                      {loading && (
                        <CgSpinner size={25} className="animate-spin mr-3" />
                      )}
                      Send Code via SMS
                    </button>
                  )}
                </div>
              </>
            )}
            </form>
        <p className="text-center text-gray-700 mt-5">
          Login Using password instead?{' '}
          <Link to='/login' className='text-black hover:underline underline-offset-2 font-semibold'>
             Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default PhoneSignIn