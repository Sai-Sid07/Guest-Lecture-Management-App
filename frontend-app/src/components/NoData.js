import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

const NoData = () => {
  const { userType } = useContext(UserContext);
    return (
        <div className="flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Oops! Nothing to See Here.
            </h1>
            <p className="text-lg text-gray-600">
              Seems Like No Event Has Been Scheduled Yet.
            </p>
            <p className="text-lg text-gray-600 font-semibold">
            Stay Tuned for Exciting Upcoming Events!.
            </p>
            {userType != "admin" ? (
              <Link to="/profile">
                <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go to my profile!
                </button>
              </Link>
            ) : (
              <Link to="/addGuest">
                <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add New Guest   
                </button>
              </Link>
            )}
          </div>
        </div>
      );
};

export default NoData