import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';

const SuccessScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center opacity-25 transition-opacity ease-in-out duration-500">
          <RiLoader4Line className="animate-spin mr-2" />
          <p className="text-lg">Creating event...</p>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col opacity-100 transition-opacity ease-in-out duration-1500">
          <FaCheck className="text-green-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Created Successfully</h2>
        </div>
      )}
    </div>
  );
};

export default SuccessScreen;
