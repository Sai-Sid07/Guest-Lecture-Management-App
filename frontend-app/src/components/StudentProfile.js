import React, { useEffect, useState } from "react";
import { UserType } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Card from "./Card";
import Fetching from "./Fetching";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState();
  const [eventData, setEventData] = useState()
  const { userEmail, setStudent } = UserType();
  const [getData, setGetData] = useState(false);
  const [email, setEmail] = useState()


  useEffect(() => {
    console.log(userEmail.toLowerCase())
    async function fetchStudentData() {
      try{
        const response = await fetch(
          `http://localhost:5000/api/get-student-data/${userEmail.toLowerCase()}`
        );
        const data = await response.json();
        if (data) {
          setStudentData(data.student_data);
          setStudent(data.student_data.name)
          setGetData(true);
          const registered_events = selectData(data.student_data, data.event_data);
          console.log(registered_events)
          const upcoming_events = filterUpcoming(registered_events)
          console.log(upcoming_events)
          setEventData(upcoming_events)
        } else {
          alert("Error while fetching");
        }
      }catch(error){
        console.log(error.message)
      }
    }
    function selectData(student_data, event_data) {
      const registeredEvents = student_data.registeredEvents;
      const selectedEvents = event_data.filter((event) =>
        registeredEvents.includes(event.eventID)
      );
    
      return selectedEvents;
    }
    function filterUpcoming(event_data) {
      const today = moment();
      const upcomingEvents = event_data
      .filter((event) => moment(event.startDate, 'DD-MM-YYYY').isSameOrAfter(today))
      .map((event) => ({
        dateStart: moment(event.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        ...event,
      }))    
      
      return upcomingEvents;
    }
    fetchStudentData();
  }, []);


  return (
    <>
      {console.log(studentData)}
      {getData ? (
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
                    {studentData.name}
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
            <div className="container mx-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-3/12 lg:order-2 flex justify-center">
                      <div className="relative">
                        <img
                          alt="..."
                          src="./profile.png"
                          // {location.state.data.imgURL}
                          //"./profile.png"
                          className="shadow-xl rounded-full h-[80%] align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                          style={{ maxWidth: "160px" }}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div className="py-6 px-3 mt-32 sm:mt-0 flex justify-center sm:block"></div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                      <div className="p-3">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            size="lg"
                            style={{ color: "#6b7280" }}
                            className="mr-2"
                          />
                          <span className="text-[13px] text-gray-500">
                            {studentData.email}
                          </span>
                        </span>
                      </div>
                      <div className="p-3">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          <FontAwesomeIcon
                            icon={faPhone}
                            size="lg"
                            style={{ color: "#6b7280" }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-500">
                            {studentData.phoneNumber}
                          </span>
                        </span>
                      </div>
                      <div className="p-3">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
                          <FontAwesomeIcon
                            icon={faIdCard}
                            size="lg"
                            style={{ color: "#6b7280" }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-500">
                            {studentData.rollNo}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                      <h1 className="text-3xl font-semibold text-gray-500">
                        Registered Events
                      </h1>
                      <div className="flex flex-wrap justify-center mt-8">
                        {eventData && eventData.length === 0 ? (
                          <h1 className="m-16">
                            Please register for events to view them here...
                          </h1>
                        ) : (
                          eventData &&
                          eventData.map((futureEvent, index) => (
                            <div key={index} className="w-1/4">
                              <Card data={futureEvent} />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <Fetching/>
      )}
    </>
  );
};

export default StudentProfile;
