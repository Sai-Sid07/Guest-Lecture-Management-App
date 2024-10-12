import React from 'react'
import { useEffect, useState } from "react";
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { UserType } from "../context/UserContext";

const AddStudent = () => {
    const {user} = UserAuth();
    const [name, setName] = useState("")
    const [rollNo, setRollNo] = useState("")
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [errors, setErrors] = useState('')
    const [loading, setLoading] = useState(true); // Added loading state
    const [exists, setExists] = useState(false);
    const { setStudent } = UserType();

    const navigate = useNavigate()

    //Shows loading screen till user data is fetched from Firebase
    useEffect(() => {
        if (user && user.email) {
          setEmail(user && user.email);
          setLoading(false);
        }
    }, [user]);

    //Will check if current student data is already present in db
    useEffect(() => { 
        const checkiFExists = async (email) => {
          console.log(`http://localhost:5000/api/check-student-profile/${email}`)
            try{
              console.log("Reached inside API Call")
                const response = await fetch(`http://localhost:5000/api/check-student-profile/${email}`);
                const data = await response.json()
                console.log(data.output)
                if(data.output){
                    setExists(true);
                }
            }catch(error){
                console.error(error);
                alert(error.message);
            }
        }
        if(email){
          checkiFExists(email);
        }
    }, [!loading])

    useEffect(() => {
        if(exists){
            // Change it to the user profile page in the future
            //add a prop called userType - student
            navigate("/viewEvents", {
              state: {
                  user: 'student',
              },
          });
        }
    }, [exists, navigate])
    //everytime exists changes to true and there is a navigate object, this is triggered

    //Finally make loading components for every page

    if (loading) {
        return <div>Loading...</div>; // Render a loading message or component
    }

    const handleRollNo = (e) => {
        const inputRollNo = e.target.value.toUpperCase();
        setRollNo(inputRollNo);
        checkRollNoPattern(inputRollNo);
    }

    const checkRollNoPattern = (rollNo) => {
        const pattern = /^CB\.EN\.U4CSE\d{5}$/;
        if(pattern.test(rollNo)){
            setRollNo(rollNo);
            setErrors({ rollNoCheck: "" });
        }else{
            setErrors({ rollNoCheck: "Invalid Roll Number" });
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            setErrors({ name: "Name is required" });
            return;
        }
        if (!rollNo) {
            setErrors({ rollNo: "Roll No is required" });
            return;
        }
        if (!phoneNumber) {
            setErrors({ number: "Mobile Number is required" });
            return;
        }
        // Create the student profile object
        const studentFormData = new FormData();
        studentFormData.append('name', name)
        studentFormData.append('rollNo', rollNo)
        studentFormData.append('email', email)
        studentFormData.append('phoneNumber', phoneNumber);
        try{
            const response_event = await fetch(
                "http://localhost:5000/api/add-student-profile",
                {
                  method: "POST",
                  body: studentFormData,
                }
              );
            if(response_event.ok){
                setErrors('')
                setStudent(name)
                setName("")
                setRollNo("")
                setPhoneNumber("")
                navigate("/viewEvents")
            }else {
                throw new Error("An error occurred while saving the student details.");
            }
        }catch(error){
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div className="flex justify-center">
        <div className="w-1/2 mt-8 p-8 bg-white rounded-lg shadow-lg">
            <h1 className='text-3xl font-bold text-center'>Create Student Profile</h1>
          <form onSubmit={handleSubmit}>
                <div className="mb-6 relative mt-4">
                  <label
                    className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className={`${errors.name ? "border-red-500 border-2" 
                    : "border-green-500 border-2"}
                    shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                    id="name"
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="mb-6 relative mt-4">
                  <label
                    className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                    htmlFor="rollNo"
                  >
                    Roll No
                  </label>
                  <input
                    className={`${errors.rollNo ? "border-red-500 border-2" 
                    : "border-green-500 border-2"}
                    shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                    id="rollNo"
                    type="text"
                    placeholder="Enter Name"
                    value={rollNo}
                    onChange={handleRollNo}
                  />
                  {errors.rollNoCheck && <p className="text-red-500">{errors.rollNoCheck}</p>}
                  {errors.rollNo && <p className="text-red-500">{errors.rollNo}</p>}
                </div> 
                <div className="mb-6 relative mt-4">
                  <label
                    className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className={`${errors.email ? "border-red-500 border-2" 
                    : "border-green-500 border-2"}
                    shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                  />
                </div>
                <div className="mb-6 relative mt-4">
                  <label
                    className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                    htmlFor="phone"
                  >
                    Mobile Number
                  </label>
                  <input
                    className={`${errors.number ? "border-red-500 border-2" 
                    : "border-green-500 border-2"}
                    shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                    id="phone"
                    type="tel"
                    placeholder='Enter Mobile Number'
                    value={phoneNumber}
                    onChange={(e) => {setPhoneNumber(e.target.value)}}
                  />
                  {errors.number && <p className="text-red-500">{errors.number}</p>}
                </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Profile
                </button>
            </div>
          </form>
          </div>
        </div>
      );
    };
export default AddStudent
/*
  registeredEvents: [String]
*/