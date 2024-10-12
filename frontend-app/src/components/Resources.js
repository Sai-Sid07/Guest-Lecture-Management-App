import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { EventData } from "../context/EventContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import File from "./File";

const Resources = () => {
  const { userType, userEmail } = useContext(UserContext);
  const [errors, setErrors] = useState();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const { event } = EventData();
  const [fileNames, setFileNames] = useState()
  const [showUpload, setShowUpload] = useState(false)

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    if(userType == "guest"){
        setShowUpload(true)
    }else{
        setShowUpload(false)
    }

  }, [])



  useEffect(() => {
    async function fetchFiles(){
        try{
            const response = await fetch(`http://localhost:5000/api/getFiles/${event.eventID}`)
            const data = await response.json()
            if(response.ok){
                setFileNames(data.resources)
                console.log("Files fetched successfully")
            }else{
                console.log("Error retrieving files")
            }
        }catch(error){
            console.log(error.message)
        }
    }
    fetchFiles()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", event.name)
      formData.append("email", event.email);
      formData.append("eventID", event.eventID)
      console.log("Event ID: ",event.eventID)
      formData.append("fileName", fileName)

      try {
        const response = await fetch("http://localhost:5000/api/uploadFile", {
          method: "POST",
          body: formData,
        });
        const data = await response.json()
        if (response.ok) {
          // File upload successful
          setFileNames(data.event.resources)
          console.log("File uploaded successfully");
        } else {
          // Handle error response
          console.log("Error uploading file");
        }
      } catch (error) {
        // Handle network error
        console.log("Error uploading file");
      }
    } else {
      // Handle file not selected error
      console.log("Please select a file");
    }
  };

  return (
    <>
      {/* <Navbar transparent /> */}
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
                  Resource Manager
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
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                {!showUpload && (
                    <h1 className="text-3xl mt-10 ml-6 font-semibold text-gray-500">Access Resources Uploaded by Guest Lecturer</h1>
                )}
                {!showUpload && fileNames && (
                    <div className="flex flex-wrap">
                        {fileNames.map((resource, index) => (
                            <div key={index} className="w-1/2 mx-5">
                                <File fileName={resource} eventID={event.eventID}/>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"></div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"></div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                    <div className="p-3">
                        {showUpload && (
                            <form
                            onSubmit={handleSubmit}
                            className="flex items-center"
                          >
                            <input
                              className={`
          shadow-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                              id="file-upload"
                              type="text"
                              placeholder="Enter File name..."
                              value={fileName}
                              onChange={(e) => {
                                setFileName(e.target.value);
                              }}
                            />
                            <div className="flex ml-4">
                              <label 
                                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-green-500 text-white rounded-md shadow-md cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faUpload} />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleUpload}
                                />
                              </label>
                              <button
                                type="submit"
                                className="ml-4 bg-blue-500 active:bg-green-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none"
                                style={{ transition: "all .15s ease" }}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        )}
                        {file && <p className="text-xs font-semibold">{file?.name} uploaded successfully</p>}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                {showUpload && fileNames && (
                    <div className="flex flex-wrap">
                        {fileNames.map((resource, index) => (
                            <div key={index} className="w-1/2 mx-5">
                                <File fileName={resource} eventID={event.eventID}/>
                            </div>
                        ))}
                    </div>
                )}
                </div>
                {/* <h1>Body of white space</h1> */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Resources; 
