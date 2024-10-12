import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

const File = ({fileName, eventID}) => {
    const handleSubmit = async(fileName, eventID) => {
        const fileSendData = new FormData()
        fileSendData.append("eventID", eventID)
        fileSendData.append("fileName", fileName)
        try{
            const response = await fetch(`http://localhost:5000/api/openFile`, {
                method: "POST",
                body: fileSendData
            })
            const data = await response.json()
            if(response.ok){
                console.log("File fetched successfully")
            }
        }catch(error){
            console.log(error.message)
        }

    }
  return (
    <div className='mb-5'>
    <div 
        className="flex flex-row items-center p-2 bg-white rounded-lg shadow w-[22%] border border-black"
        onClick={() => handleSubmit(fileName, eventID)}>
      <div className="flex-shrink-0 w-1/4">
        <FontAwesomeIcon icon={faFile} className="text-yellow-500 text-3xl"/>
      </div>
      <div className="w-3/4">
        <h3 className="text-md font-semibold text-gray-600">{fileName}</h3>
      </div>
    </div>
    </div>
  );
};

export default File