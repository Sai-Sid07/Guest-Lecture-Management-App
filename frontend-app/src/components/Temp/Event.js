import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Comments from '../Comments/Comments';

const Event = () => {
  const [isPopoutVisible, setIsPopoutVisible] = useState(false);
  const location = useLocation()
  console.log(location)

  // const name = 'John Doe';
  // const email = 'johndoe@example.com';
  // const lectureTopic = 'Introduction to Deep Learning';
  // const startTime = '10:00 AM';
  // const endTime = '12:00 PM';
  // const startDate = '2023-05-16';
  // const endDate = '2023-05-18';
  // const venue = "Amriteshwari Hall"
  
  //Add a link to access event resources
  //similar logic to chem conference app

  //Add comments section logic

  const togglePopout = () => {
    setIsPopoutVisible(!isPopoutVisible);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-teal-100">
        <h2 className="text-2xl font-semibold text-center p-4">
          {location.state.data.topic}
        </h2>
      </div>
      <div className="flex items-center mt-8">
        <img
          src="https://via.placeholder.com/60x60"
          alt="Profile"
          className="rounded-full w-16 h-16 mr-4"
        />
        <div>
          <h1
            className="text-2xl font-semibold cursor-pointer"
            onClick={togglePopout}
          >
            {location.state.data.name}
          </h1>
          <p className="text-sm text-gray-500">{location.state.data.email}</p>
        </div>
        <div className="ml-auto">
          <div>
            <p className="text-base">
              <span className="text-xl font-semibold mb-2">Date:</span>
              {location.state.data.startDate} - {location.state.data.endDate}
            </p>
          </div>
          <div>
            <p className="text-base">
              <span className="text-xl font-semibold mb-2">Time: </span>
              {location.state.data.startTime} - {location.state.data.endTime}
            </p>
          </div>
          <div>
            <p className="text-base">
              <span className="text-xl font-semibold mb-2">Venue: </span>
              {location.state.data.venue}
            </p>
          </div>
        </div>
        {isPopoutVisible && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-opacity-50 bg-gray-900 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={togglePopout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L10 8.586 5.707 4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 1 0 1.414-1.414L11.414 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-semibold">{location.state.data.name}</h1>
                <p className="text-sm text-gray-500">{location.state.data.email}</p>
                <p className="text-sm text-gray-500">{location.state.data.designation}</p>
                <p className="text-sm text-gray-500">{location.state.data.researchFields}</p>
              </div>
            </div>
          </div>
        )}
        {/* <Comments currentUserId="1"/> */}
      </div>
      <div>
        <h1 className="text-2xl font-semibold my-10">Interactive Corner!</h1>
      </div>
      <div>
        <Comments currentUserId="1" />
      </div>
    </div>
  );
};

export default Event;