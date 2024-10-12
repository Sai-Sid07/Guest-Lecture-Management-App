import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//Note to Self - Use FormData object when sending any type of File in the post request.
//NOTE - Page should redirect to the guest list page upon successful submission 
//Else use JSON
//Note - Use uploads image
//write logic for: image goes to backend
//uploaded to s3 and retrived from s3 and given a link to be used in mongodb
//for all images use amazons3


function GuestDetails() {
  //For Navigation
  const navigate = useNavigate();
  //Error Handling
  const [errors, setErrors] = useState({});
  //Logic for Image Preview
  const [selectedImage, setSelectedImage] = useState();
  const [imageURL, setImageURL] = useState("https://via.placeholder.com/60x60")

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage();
    setImageURL("https://via.placeholder.com/60x60")
  };

  const hiddenFileInput = useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (selectedImage) {
      setImageURL(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const userCircleStyle = {
    backgroundImage: `url(${imageURL})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
  /***************************************************/

  //Storing input values 
  const [name, setName] = useState("")
  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const [email, setEmail] = useState("")
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const [designation, setDesignation] = useState("")
  const handleDesignationChange = (e) => {
    setDesignation(e.target.value)
  }

  const [lecture, setLecture] = useState("")
  const handleLectureChange = (e) => {
    setLecture(e.target.value)
  }

  const [researchTopics, setResearchTopics] = useState([]);

  const handleResearchTopicsChange = (event) => {
    const value = event.target.value;
    const topicsArray = value.split(",").map((topic) => topic.trim());
    setResearchTopics(topicsArray);
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    console.log(date)
    setSelectedDate(date);
  };

  const [location, setLocation] = useState("");

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  /***************************************************/

  //Handle Submit
  const handleSubmit = async (event) => {
    event.preventDefault();   
    //Error handling
    if (!selectedImage) {
      setErrors({ image: "Profile Picture is required" });
      return;
    }
    if (!name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!designation) {
      setErrors({ designation: "Designation is required" });
      return;
    }
    if (researchTopics.length === 0) {
      setErrors({ researchTopics: "Research Fields cannot be empty" });
      return;
    }
    if (!lecture) {
      setErrors({ lecture: "Lecture is required" });
      return;
    }
    if (!selectedDate) {
      setErrors({ date: "Date is required" });
      return;
    }
    if (!location) {
      setErrors({ location: "Venue is required" });
      return;
    }

    const formData = new FormData();
    formData.append('name', name)
    formData.append('email', email)
    formData.append('designation', designation)
    formData.append('lecture', lecture)
    formData.append('researchTopics', researchTopics)
    formData.append('date', selectedDate)
    formData.append('location', location)
    console.log(selectedImage)
    formData.append('image', selectedImage);
    // if (selectedImage) {
    //   formData.append("image", selectedImage);
    // }
    try {
      const response = await fetch("http://localhost:5000/api/guest-lecturers", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // alert("Guest lecturer details saved successfully.");
        setName("");
        setEmail("");
        setDesignation("");
        setLecture("");
        setResearchTopics([]);
        setSelectedDate(null);
        setLocation("");
        setSelectedImage();
        setImageURL("https://via.placeholder.com/60x60");
        navigate("/viewEvents")
      } else {
        throw new Error("An error occurred while saving the guest lecturer details.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // const isFormValid = Boolean(name && email && designation && lecture && selectedDate && location);

  return (
    <div className="flex justify-center">
      <div className="w-1/2 mt-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Add Guest Lecturer Details</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <div className="mt-2 flex items-center gap-x-3">
                <div
                  className={`${errors.image ? "h-[60px] w-[60px] rounded-full border-2 border-red-500" : "h-[60px] w-[60px] rounded-full border-2 border-gray-300"}`}
                  style={userCircleStyle}
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
                  onClick={handleClick}
                >
                  Upload New Picture
                </button>
                <input
                  accept="image/*"
                  type="file"
                  ref={hiddenFileInput}
                  className="hidden"
                  onChange={imageChange}
                />
                <button
                  type="button"
                  className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-600"
                  onClick={removeSelectedImage}
                >
                  Delete
                </button>
              </div>
              {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className={`${errors.name ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="name" 
              type="text"
              placeholder="Enter Name"
              onBlur={handleNameChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`${errors.email ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="email"
              type="email"
              placeholder="Enter Email"
              onBlur={handleEmailChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="designation">
              Designation
            </label>
            <input
              className={`${errors.designation ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="designation"
              type="text"
              placeholder="Enter Designation"
              onBlur={handleDesignationChange}
            />
            {errors.designation && <p className="text-red-500">{errors.designation}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="researchTopics">
              Research Fields
            </label>
            <input
              type="text"
              id="researchTopics"
              className={`${errors.researchTopics ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              onChange={handleResearchTopicsChange}
              placeholder="Enter Research Fields (..,..)"
              value={researchTopics.join(", ")}
            />
            {errors.researchTopics && <p className="text-red-500">{errors.researchTopics}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="topic">
              Lecture Topic
            </label>
            <input
              className={`${errors.lecture ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="topic"
              type="text"
              placeholder="Enter Lecture Topic"
              onBlur={handleLectureChange}
            />
            {errors.lecture && <p className="text-red-500">{errors.lecture}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="date-of-speech">
              Date of Speech
            </label>
            <DatePicker
              id="date-of-speech"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className={`${errors.date ? "border-red-500" : ""}border-gray-400 border-2 rounded-md p-2 w-full`}
            />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="location">
              Venue
            </label>
            <select
              className={`${errors.location ? "border-red-500" : ""}
              appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="location"
              value={location}
              onChange={handleLocationChange}
            >
              <option value="">Select a location</option>
              <option value="Amriteshwari Hall">Amriteshwari Hall</option>
              <option value="Hall 2">Hall 2</option>
              <option value="Hall 3">Hall 3</option>
              <option value="Hall 4">Hall 4</option>
            </select>
            {errors.location && <p className="text-red-500">{errors.location}</p>}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            // disabled={!isFormValid}
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuestDetails;