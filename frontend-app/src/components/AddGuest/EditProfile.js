import React from "react";
import { useEffect, useRef, useState } from "react";

const EditProfile = ({
  nextStep,
  imageURL,
  setImageURL,
  selectedImage,
  setSelectedImage,
  selectedName,
  setSelectedName,
  name,
  setName,
  email,
  setEmail,
  designation,
  setDesignation,
  researchTopics,
  setResearchTopics,
  selectedOption,
  setSelectedOption,
  institution,
  setInstitution,
  filledForm,
  setFilledForm
}) => {
    const [errors, setErrors] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [lecturerNames, setLecturerNames] = useState([]);
    const hiddenFileInput = useRef(null);
  
    const imageChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedImage(e.target.files[0]);
      }
    };
    
    const removeSelectedImage = () => {
      setSelectedImage();
      setImageURL("https://via.placeholder.com/60x60");
    };
  
    const handleClick = () => {
      hiddenFileInput.current.click();
    };
  
    const userCircleStyle = {
      backgroundImage: `url(${imageURL})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  
    useEffect(() => {
      if (selectedImage) {
        setImageURL(URL.createObjectURL(selectedImage));
      }
    }, [selectedImage]);
  
    const handleResearchTopicsChange = (event) => {
      const value = event.target.value;
      const topicsArray = value.split(/,\s*/).map((topic) => topic.trim());
      setResearchTopics(topicsArray);
    };
  
    useEffect(() => {
      async function fetchNames() {
        const response = await fetch("http://localhost:5000/api/list-lecturers");
        const data = await response.json()
        const simplifiedLecturers = await data.map(({ name, email }) => ({ name, email }));
        console.log(simplifiedLecturers)
        setLecturerNames(simplifiedLecturers);
      }
      fetchNames();
    }, []);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      //Either show errors for radio = "yes" or radio = "no"
      if(selectedOption == "yes"){
        console.log(!selectedName)
        if(!selectedName){
          setErrors({dropDown: "Please select an option"})
          return
        }
      }else{
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
        if (!institution) {
          setErrors({ institution: "Institution cannot be empty" });
          return;
        }
        if (researchTopics.length === 0) {
          setErrors({ researchTopics: "Research Fields cannot be empty" });
          return;
        }
      }

      console.log("Email: ", email)
      console.log("Name: ", name)
      nextStep();
    };
  
    const handleRadioChange = (event) => {
      const value = event.target.value;
      setSelectedOption(value);
      if (value === "yes") {
        setShowDropdown(true);
        setFilledForm(false);
      } else if (value === "no") {
        setShowDropdown(false);
        setFilledForm(true);
      }
    };

    const handleSelection = (event) => {
      const selectedValue = event.target.value;
      console.log(selectedValue)
      console.log(!selectedName)
      //useState is asynchronous is nature and the change might not be immediately reflected
      setSelectedName(selectedValue);

      //We have to split the name separately and the email
      // Split the string into an array of words
      const words = selectedValue.split(/\s+/);
      // Find the position of the email by searching for the '@' symbol
      const emailIndex = words.findIndex((word) => word.includes('@'));
      // Join the name words into a string
      const name = words.slice(0, emailIndex).join(' ');
      // Extract the email as a separate string
      const email = words[emailIndex];

      console.log(name);
      console.log(email);
      
      setName(name);
      setEmail(email);
    }
  
  return (
    <div>
      <div className="grid gap-4 place-content-center items-center">
          <h1 className="text-gray-700 pb-8 font-bold text-2xl">Guest Info</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <span className="text-gray-800 font-bold">
            Existing Guest Lecturer?
          </span>
          <div className="mt-2">
            <div className="flex items-center">
              <input
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-black-300 ml-5"
                id="yes"
                type="radio"
                value="yes"
                name="existingLecturer"
                onChange={handleRadioChange}
              />
              <label
                htmlFor="yes"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                id="no"
                name="existingLecturer"
                type="radio"
                value="no"
                defaultChecked={true}
                onChange={handleRadioChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-black-300 ml-5"
              />
              <label
                htmlFor="no"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                No
              </label>
            </div>
          </div>
          {errors.radio && <p className="text-red-500">{errors.radio}</p>}
        </div>
        {showDropdown && (
          <div className="mt-6">
            <label
              htmlFor="lecturerName"
              className="block text-sm font-medium text-gray-700"
            >
              Select a name
            </label>
            <select
              id="name"
              name="name"
              className={`${errors.dropDown ? "border-red-500" : ""}
              mt-1 block w-full pl-3 pr-10 py-2 mb-5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
              value={selectedName}
              onChange={handleSelection}
            > 
              <option value="">Select a name</option>
              {lecturerNames.map(({ name, email }) => (
                <option key={name} value={name + " " + email}>
                  {name + ", " + email}
                </option>
              ))}
            </select>
            {errors.dropDown && <p className="text-red-500">{errors.dropDown}</p>}
          </div>
        )}
        {!showDropdown && (
          <>
            <div className="mb-4">
          <div className="mt-2 flex items-center gap-x-3">
            <div
              className={`${
                errors.image
                  ? "h-[60px] w-[60px] rounded-full border-2 border-red-500"
                  : "h-[60px] w-[60px] rounded-full border-2 border-gray-300"
              }`}
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
            <div className="mb-4 relative mt-4">
              <label
                className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className={`${errors.name ? "border-red-500 border-2" 
                : "border-blue-500 border-2"}
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                id="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div className="mb-4 relative mt-4">
              <label
                className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={`${errors.email ? "border-red-500 border-2" 
                : "border-blue-500 border-2"}
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="mb-4 relative mt-4">
              <label
                className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                htmlFor="designation"
              >
                Designation
              </label>
              <input
                className={`${errors.designation ? "border-red-500 border-2" 
                : "border-blue-500 border-2"}
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                id="designation"
                type="text"
                placeholder="Enter Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
              {errors.designation && (
                <p className="text-red-500">{errors.designation}</p>
              )}
            </div>
            <div className="mb-4 relative mt-4">
              <label
                className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                htmlFor="institution"
              >
                Institution/Organization
              </label>
              <input
                className={`${errors.institution ? "border-red-500 border-2" 
                : "border-blue-500 border-2"}
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                id="designation"
                type="text"
                placeholder="Enter Institution/Organization"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                style={{ boxShadow: 'none' }}
              />
              {errors.institution && (
                <p className="text-red-500">{errors.institution}</p>
              )}
            </div>
            <div className="mb-4 relative mt-4">
              <label
                className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
                htmlFor="researchTopics"
              >
                Research Fields
              </label>
              <input
                type="text"
                id="researchTopics"
                className={`${errors.researchTopics ? "border-red-500 border-2" 
                : "border-blue-500 border-2"}
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
                onChange={handleResearchTopicsChange}
                placeholder="Enter Research Fields (..,..)"
                value={researchTopics.join(", ")}
                style={{ boxShadow: 'none' }}
              />
              {errors.researchTopics && (
                <p className="text-red-500">{errors.researchTopics}</p>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end">
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Next
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
