import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from "../context/UserContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { EventData } from "../context/EventContext";
import moment from "moment";


const Card = ({data}) => {
  const navigate = useNavigate();
  const { userType } = useContext(UserContext);
  const { event, setEventData } = EventData()
  const entry = data;
  const isAdmin = userType === "admin";

  const handleDelete = async (entry, eventID) => {
    const today = moment().startOf('day');
    const pastEvent = moment(entry.startDate).isBefore(today)
    try{
      const response = await fetch(
        `http://localhost:5000/api/deleteEvent/${eventID}`,
        {
          method: "POST",
        }
      );
      console.log(response);
      if (response.ok) {
        navigate("/viewEvents", {
          state:{
            pastEvent: pastEvent,
          }
        });
      } else {
        alert("Failed to Delete.")
        navigate("/viewEvents", {
          state:{
            pastEvent: pastEvent,
          }
        });
      }
    }catch(error){
      throw new Error("An error occurred while deleting entry.");
    }
  };

  const backgroundImages = [
    "./bg_1.png",
    "./bg_2.png",
    "./bg_3.png",
    "./bg_4.png",
    // Add more image URLs here
  ];

  const randomBackgroundImage =
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  const lectureTopicStyle = {
    backgroundImage: `url(${randomBackgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  const userCircleStyle = {
    backgroundImage: `url(${entry.imgURL || './placeholder.png'})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };


  const handleHover = (event) => {
    const card = event.currentTarget;
    card.style.transform = 'scale(1.1)';
    card.style.transition = 'transform 0.4s ease-in-out';
  };

  const handleLeave = (event) => {
    const card = event.currentTarget;
    card.style.transform = 'scale(1)';
    card.style.transition = 'transform 0.4s ease-in-out';
  };

  const handleRowClick = (object) => {
    //Filtering events based on current date
  const today = moment().startOf('day');
  console.log("Event Start Date: ",moment(object.startDate,'DD-MM-YYYY').isAfter(today))
  const pastEvent = moment(object.dateStart,'DD-MM-YYYY').isBefore(today)
  const updatedObject = { ...object, pastEvent };
  console.log("Event state set in context - ", pastEvent)
  setEventData(updatedObject)
  console.log("Event Context Set")
    navigate('/profile');
  };

  return (
    <>
      <div className="p-5 pt-9">
        <div 
          className="w-72 h-72 rounded-2xl overflow-hidden relative shadow-lg border-[1px] border-gray-400"
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          style={{
            transform: 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
          onClick={() => handleRowClick(entry)}
        >
          {/* Placeholder background for lecture topic */}
          <div className="h-[60%]" style={lectureTopicStyle}>
            <div className="flex items-center justify-center h-full">
              <span className="text-3xl px-3 font-bold text-white" style={{ fontSize: 'clamp(1.5rem, 1.875rem, 1.6rem)' }}>
                {entry.topic ? entry.topic : <Skeleton containerClassName="flex-1"/>}
              </span>
            </div>
          </div>

          {/* Circle placeholder for image */}
          <div
            className="absolute right-2 mt-2 w-12 h-12 bg-gray-400 rounded-full"
            style={userCircleStyle}
          >
          </div>

          {/* Name */}
          <div className="absolute left-3 mt-2">
            <span className="text-sm font-bold text-gray-600">
              {entry.name ? entry.name : <Skeleton containerClassName="flex-1"/>}
            </span>
          </div>

          {/* Date text */}
          <div className="absolute bottom-3 left-3">
            <span className="text-sm font-semibold text-gray-600">
              {entry.dateStart ? entry.dateStart : <Skeleton containerClassName="flex-1"/>}
            </span>
          </div>
          {isAdmin && (
            <div className="absolute bottom-2 right-7">
              <button
                      onClick={() => handleDelete( entry, entry.eventID)}
                      className="ml-2 text-red-500 font-bold"
              >
                      <FontAwesomeIcon icon={faTrash} />
              </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
