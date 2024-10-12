import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faBriefcase, faLocationDot, faClock, faCalendarDay, faBookOpenReader, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import { EventData } from "../context/EventContext";

const Profile = () => {
    const { userType, userEmail } = useContext(UserContext);
    const { event } = EventData()
    const [render, setRender] = useState(true)    
    const [registered, setRegistered] = useState(false)

    useEffect(() => {
      //Check if Student has registered for the event
      async function checkStudentPresent(){
        console.log("Check Student Present")
        const response = await fetch(`http://localhost:5000/api/checkRegistered/${userEmail}`)
        console.log(response)
        const data = await response.json()
        if(data.registeredEvents.includes(event.eventID)){
          setRegistered(true)
        }else{
          setRegistered(false)
        }
      }
      if(event.pastEvent){
        setRender(false);
      }
      if(userType === "student"){
        checkStudentPresent()
      }
      
    }, [])

    useEffect(() => {
      // Update the navigation based on the user type
      console.log("Reached useEffect - ", userType);
      if (userType === "admin") {
        setRender(false)
      } else if (userType === "guest") {
        setRender(false)
      }
    }, [userType]);

    const handleRegisterEvent = async (eventID) => {
      console.log("Student Email - ", userEmail)
      const response = await fetch(`http://localhost:5000/api/registerEvent/:${eventID}/:${userEmail}`, {
        method: "POST"
      })
      if(response.ok){
        alert("Successfully Registered for event. Please Check your email")
        setRegistered(true)

      }
      console.log(eventID)
      console.log(userEmail)
      console.log("Reached Click Event")
    }

  return (
    <>
      {/* <Navbar transparent /> */}
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            >
              <div className="flex justify-center items-center h-[50%]">
                <h1 className="text-5xl font-semibold tracking-wide text-center bg-transparent text-white">
                  {event.topic}
                </h1>
              </div>
            </span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src={event.imgURL}
                        // {location.state.data.imgURL}
                        //"./profile.png"
                        className="shadow-xl rounded-full h-[80%] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                        style={{ maxWidth: "160px" }}
                      />
                    </div>
                  </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div className="py-6 px-3 mt-32 sm:mt-0 flex justify-center sm:block">
                        {render && (
                          registered ? (
                            <button
                            className="bg-green-500 uppercase text-white font-bold shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            disabled={true}
                          >
                            Already Registered
                          </button>
                          ) : (
                            <button
                            className="bg-blue-500 active:bg-green-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                            type="button"
                            style={{ transition: "all .15s ease" }}
                            onClick={() => handleRegisterEvent(event.eventID)}
                          >
                            Register for Event
                          </button>
                            
                          )
                        )}
                      </div>
                    </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faClock}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          {event.startTime} - {event.endTime}
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faCalendarDay}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          {event.dateStart}
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          {event.venue}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="text-4xl font-semibold leading-normal text-gray-800 mb-2">
                    {event.name}
                    <h1 className="text-base text-gray-500">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ color: "#6b7280" }}
                        className="mr-2"
                      />
                      {event.email}
                    </h1>
                  </div>
                  <div className="mb-2 text-gray-700 mt-10">
                    <FontAwesomeIcon
                      icon={faBuildingColumns}
                      size="lg"
                      style={{ color: "#6b7280" }}
                      className="mr-2"
                    />
                    {event.designation}
                  </div>
                  <div className="mb-2 text-gray-700">
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      size="lg"
                      style={{ color: "#6b7280" }}
                      className="mr-2"
                    />
                    {event.institution}
                  </div>
                  <div className="mb-2 text-gray-700">
                    <FontAwesomeIcon
                      icon={faBookOpenReader}
                      size="lg"
                      style={{ color: "#6b7280" }}
                      className="mr-2"
                    />
                    {event.researchFields}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-gray-800">
                        {event.aboutSpeech}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Profile

{/* Replace this with div where Time, Location Date icons are given incase that doesn't look good
<div className="mr-4 p-3 text-center">
    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
        26-05-23
    </span>
    <span className="text-sm text-gray-500">Start Date</span>
</div>
<div className="lg:mr-4 p-3 text-center">
    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
        12:05 <span className="lowercase">pm</span>
    </span>
    <span className="text-sm text-gray-500">Start Time</span>
</div>
<div className="mr-4 p-3 text-center">
    <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
        2
    </span>
    <span className="text-sm text-gray-500">Hour(s)</span>
</div> */}