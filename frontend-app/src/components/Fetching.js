import React from 'react'

const Fetching = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <div className="text-center">
            <h1 className="text-4xl mb-12">Fetching Data...</h1>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            </div>
          </div>
        </div>
      );
};

export default Fetching