import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 overflow-hidden">
        <img
          className="object-cover object-center w-full h-full"
          src="./banner.png"
          alt="Banner"
        />
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
      </div>
      <div className="text-center z-10">
        <h1 className="text-6xl font-bold mb-8 text-white">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AGLES
          </span>
        </h1>
        <p className="text-3xl text-gray-300">Unlocking Wisdom, One Guest Lecture at a time</p>
        <div className="mt-8 space-x-4">
          <Link to="/login" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded">Login</Link>
          <Link to="/signup" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
