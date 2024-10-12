import React, { useState } from 'react';

const FetchResource = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("Form Request Made!")
      console.log(selectedValue)
      const response = await fetch(`http://localhost:5000/api/generateReport/report/${selectedValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optional: If you need to send any data in the request body, you can add it here
        // body: JSON.stringify({ key: value }),
      });

      if (!response.ok) {
        throw new Error('Error generating report');
      }

      // Process the response as needed
      console.log('Report generated successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border rounded-md p-8 w-1/2">
        <h1 className="text-2xl mb-4 text-center">Generate Reports</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportType">
              Report Type
            </label>
            <select
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reportType"
              name="reportType"
              value={selectedValue}
              onChange={handleSelectChange}
            >
              <option value="">Select report type</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FetchResource;
