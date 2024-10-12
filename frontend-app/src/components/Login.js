import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { UserType } from "../context/UserContext";
import { useState } from 'react';
import { CgSpinner } from "react-icons/cg";

const Login = () => {
  const {signIn} = UserAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')
  const { setUser, setUserEmail, setStudent } = UserType();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('')
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
      console.log(email)
      console.log(password)
      await signIn(email, password)
      const identifier = email.substring(0, 5);
      console.log(identifier)
      setUserEmail(email)
      if(identifier == "admin"){
        setUser("admin")
        navigate("/viewEvents", {
          state:{
            pastEvent: false,
          }
        })
      }else if(identifier == "guest"){
        setUser("guest")
        navigate("/viewEvents", {
          state:{
            pastEvent: false,
          }})
      }else{
        setUser("student")
        //Set the student name using their email during login itself
        //Making a backend call and fetching the details
        try{
          const response = await fetch(
            `http://localhost:5000/api/get-student-data/${email}`
          );
          const data = await response.json();
          if (data) {
            setStudent(data.student_data.name)
          } else {
            alert("Error while fetching");
          }
        }catch(error){
          console.log(error.message)
        }
        navigate("/viewEvents", {
          state:{
            pastEvent: false,
          }})
      }
    }catch(e){
      setErrors({auth: "User Not found"})
      console.log(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 h-screen ">
        <img src="./login_bg.png" alt="Login Image" className="h-full w-full object-fit-cover"/>
      </div>
      <div className="md:w-1/2 h-full flex flex-col items-center justify-center bg-[#FFF0DF]">
        <h1 className="text-3xl mb-4 font-bold">Login</h1>
        {/* <p className='text-lg mb-2'>Welcome Back! Log in to proceed</p> */}
        <form 
          className="bg-[#FFF0DF] p-10 border-0 w-full md:w-2/3 lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="mb-6">
            {/* shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline */}
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
              autoComplete='new-password'
              onChange={(e) => setEmail(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-2">
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
          <div className="flex justify-between items-center mb-4">
            <Link to="/forgotPassword" className="text-black text-sm font-semibold hover:underline my-5">
              Forgot Password?
            </Link>
          </div>
          {errors.auth && <p className="text-red-500 font-semibold text-center mb-5">{errors.auth}</p>}
          <button
            className="bg-[#060606] hover:bg-[#ffffff] text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {loading ? (
                <CgSpinner size={35} className="animate-spin mx-auto" />
            ) : (
              <span>Sign In</span>
            )}

          </button>          
          <Link to="/phone"> 
            <button
              className="bg-[#ffffff] hover:bg-[#000000] text-black hover:text-white font-bold py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In with Phone
            </button>
          </Link>
        </form>
        <p className="text-center text-gray-700 mt-5">
          Don't have an account?{' '}
          <Link to='/signup' className='text-black hover:underline underline-offset-2 font-semibold'>
             Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
