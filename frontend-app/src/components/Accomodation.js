import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faBriefcase, faLocationDot, faCalendar, faClock, faJetFighter, faMapPin, faHotel, faLocationPin } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../context/UserContext";
import { EventData } from "../context/EventContext";

const Accomodation = () => {
    const { userType, userEmail } = useContext(UserContext);
    const { event } = EventData()
    const [render, setRender] = useState(true)   
    const [accomodation, setAccomodation] = useState({}) 
    const [registered, setRegistered] = useState(false)

    // useEffect(() => {
    //   // Update the navigation based on the user type
    //   console.log("Reached useEffect - ", userType);
    //   if (userType === "admin") {
    //     setRender(false)
    //   } else if (userType === "guest") {
    //     setRender(false)
    //   }
    // }, [userType]);

    useEffect(() => {
        async function fetchEvents() {
        console.log("Fetching Guest Accomodation")
        const response = await fetch("http://localhost:5000/api/getAccomodation");
        const guestData = await response.json(); 
        setAccomodation(guestData)
            
        }
          fetchEvents();
      }, []);

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
                  Travel and Accomodation
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
                        src="https://guest-lecture-bucket.s3.ap-south-1.amazonaws.com/DP/Tim%20Cook_timcook%40apple.com?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA42UWYXXPZUQTYKMX%2F20230613%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230613T211140Z&X-Amz-Expires=604800&X-Amz-Signature=c75a99cbbf6baa15797e432914eee1ca2e61fe32c41d701c6d2f488f4b9d8994&X-Amz-SignedHeaders=host&x-id=GetObject"
                        // {location.state.data.imgURL}
                        //"./profile.png"
                        className="shadow-xl rounded-full h-[80%] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                        style={{ maxWidth: "160px" }}
                      />
                    </div>
                  </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div className="py-6 px-3 mt-32 sm:mt-0 flex justify-center sm:block">
                      <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faHotel}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          CLARION HOTEL COIMBATORE
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faLocationPin}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                        Fun republic Mall, Ward 56, East Zone
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faClock }
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          1 Night(s)
                        </span>
                      </span>
                    </div>
                      </div>
                    </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faJetFighter}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          AI429
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faMapPin}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          MAA - CJB
                        </span>
                      </span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          size="lg"
                          style={{ color: "#6b7280" }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-500">
                          21-06-2023
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <div className="text-4xl font-semibold leading-normal text-gray-800 mb-2">
                    Tim Cook
                  </div>
                  <div className="mb-2 text-gray-700">
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-gray-800">
                        
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
  )
}

export default Accomodation