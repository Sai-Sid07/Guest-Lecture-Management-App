// import React from "react";
// // import Card from "./Form3";
// import { useEffect, useState, useContext } from 'react';
// import moment from 'moment';
// import { UserContext } from "../../context/UserContext";
// import { useLocation } from "react-router-dom";

// const Events = () => {
//   const [title, setTitle] = useState("")
//   const [events, setEvents] = useState([]);
//   const [pastEvents, setPastEvents] = useState([]);
//   const [futureEvents, setFutureEvents] = useState([]);
//   const { userType, userEmail } = useContext(UserContext);
//   const location = useLocation()
//   const viewPast = location.state.viewPast


//   useEffect(() => {
//     if(viewPast){
//       setTitle("Past Events")
//     }else{
//       setTitle("Upcoming Events")
//     }
//   }, [])


//   useEffect(() => {
//     async function fetchEvents() {
//       console.log(userType)
//       if(userType === "admin" || userType === "student"){
//         const response = await fetch("http://localhost:5000/api/events/temp");
//         const combinedData = await response.json(); 
//         setEvents(combinedData); 
//       }else{
//         console.log("In here in else")
//         console.log(userEmail)
//         const response = await fetch(`http://localhost:5000/api/events/:${userEmail}`);
//         const combinedData = await response.json(); 
//         setEvents(combinedData);
//       }
//     }
//       fetchEvents();
//   }, []);

//   useEffect(() => {
//     // console.log(events)
//     const today = moment().startOf('day');
//     //Filtering events based on current date
//     const pastEventsList = events
//       .filter((event) => moment(event.startDate).isBefore(today))
//       .map((event) => ({
//         dateStart: moment(event.startDate).format('DD-MM-YYYY'),
//         dateEnd: moment(event.endDate).format('DD-MM-YYYY'),
//         ...event,
//       }));
//     const futureEventsList = events
//       .filter((event) => moment(event.startDate).isSameOrAfter(today))
//       .map((event) => ({
//         dateStart: moment(event.startDate).format('DD-MM-YYYY'),
//         dateEnd: moment(event.endDate).format('DD-MM-YYYY'),
//         ...event,
//       }));
//     setPastEvents(pastEventsList);
//     setFutureEvents(futureEventsList);
//   }, [events]);

//   return (
//     <>
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//           <h2 className="text-xl text-gray-500 font-semibold">
//             {title === "Upcoming Events" ? (
//               futureEvents.length === 0 ? "" : title
//             ) : pastEvents.length === 0 ? "" : title}
//             {/* {count > 0 ? "(" + count + ")" : <Skeleton />} */}
//             {/* Upcoming Events */}
//           </h2>
//         <div className="flex flex-wrap justify-center gap-0">
//           {viewPast && pastEvents.map((pastEvent, index) => (
//             <div key={index} className="w-1/4">
//               <Card event={pastEvent}/>
//             </div>
//           ))}
//           {futureEvents.length === 0 ? (
//             <h1>Nothing to Display here..</h1>
//           ) : (
//             (!viewPast && futureEvents.map((futureEvent, index) => (
//               <div key={index} className="w-1/4">
//                 <Card data={futureEvent}/>
//               </div>
//             )))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Events;

import React, { useEffect, useRef, useState } from 'react'
import { FaFile } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

const ParentForm = () => {
  return (
    <div className='m-20'>
    <div className="flex items-center p-2 bg-white rounded-lg shadow w-[18%] border border-black">
      <div className="flex-shrink-0 w-1/4">
        <FontAwesomeIcon icon={faFile} className="text-yellow-500 text-3xl"/>
      </div>
      <div className="w-3/4">
        <h3 className="text-md font-semibold text-gray-600">Card Title is very big</h3>
      </div>
    </div>
    </div>
  );
};

export default ParentForm



