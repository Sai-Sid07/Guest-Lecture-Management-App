import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { CgSpinner } from "react-icons/cg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { sendResetEmail } = UserAuth();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!email) {
      setErrors({ email: "Email cannot be empty" });
      return;
    }
    try {
      await sendResetEmail(email);
      setLinkSent(true);
      setErrors({ message: "Reset link sent!" });
    } catch (error) {
      setErrors({ auth: "User doesn't exist. Please Sign Up" });
    } finally {
      setLoading(false);
    }
    console.log("Submit Clicked");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 h-screen ">
        <img
          src="./login_bg.png"
          alt="Login Image"
          className="h-full w-full object-fit-cover"
        />
      </div>
      <div className="md:w-1/2 h-full flex flex-col items-center justify-center bg-[#FFF0DF]">
        <div className="group mb-5">
          <h1 className="text-3xl mb-8 font-bold cursor-pointer">Forgot Password?</h1>
          <span className="absolute max-w-xs -ml-[35px] mt-[-15px]  scale-0 transition-all rounded delay-75 break-words bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
            Once your email is verified, a reset link will be sent to your inbox
            where you would be able to reset your password.
          </span>
        </div>
        <form
          className="bg-[#FFF0DF] p-10 border-0 w-full md:w-2/3 lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <>
            <div className="mb-2">
              <input
                className={`${errors.email ? "border-red-500" : "border-black"}
                    w-full border-0 focus:border-0 bg-transparent text-black border-b focus:border-b focus:border-black`}
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="new-password"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                style={{ boxShadow: "none" }}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            {errors.auth && (
              <p className="text-red-500 font-semibold text-center">
                {errors.auth}
              </p>
            )}
            {errors.message && (
              <p className="text-green-500 font-semibold text-center">
                {errors.message}
              </p>
            )}
            <div className="flex w-full justify-center items-center">
              <button className="bg-[#060606] hover:bg-[#ffffff] text-white hover:text-black font-bold py-2 px-4 mt-7 rounded focus:outline-none focus:shadow-outline w-[75%] flex items-center justify-center">
                {loading ? (
                  <CgSpinner size={25} className="animate-spin mr-3" />
                ) : linkSent ? (
                  <Link to="/login">Log In</Link>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </>
        </form>
        <p className="text-center text-gray-700">
          Login instead?{' '}
          <Link to='/login' className='text-black hover:underline underline-offset-2 font-semibold'>
             Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

