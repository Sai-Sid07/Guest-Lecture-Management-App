// import React from 'react'
// import { useState, useEffect, useRef } from 'react';

// const Form1 = ({
//     nextStep,
//     imageURL,
//     setImageURL,
//     selectedImage,
//     setSelectedImage,
//     name,
//     setName,
//     email,
//     setEmail,
//     designation,
//     setDesignation,
//     researchTopics,
//     setResearchTopics,
//     institution,
//     setInstitution,
//     filledForm,
//     setFilledForm
//   }) => {
//     const [errors, setErrors] = useState({});
//     const [selectedOption, setSelectedOption] = useState("no");
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [lecturerNames, setLecturerNames] = useState([]);
//     const [selectedName, setSelectedName] = useState("");
//     const hiddenFileInput = useRef(null);

//     const imageChange = (e) => {
//         if (e.target.files && e.target.files.length > 0) {
//           setSelectedImage(e.target.files[0]);
//         }
//       };
    
//       const removeSelectedImage = () => {
//         setSelectedImage();
//         setImageURL("https://via.placeholder.com/60x60");
//       };
    
//       const handleClick = () => {
//         hiddenFileInput.current.click();
//       };
    
//       const userCircleStyle = {
//         backgroundImage: `url(${imageURL})`,
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         backgroundSize: "cover",
//       };
    
//       useEffect(() => {
//         if (selectedImage) {
//           setImageURL(URL.createObjectURL(selectedImage));
//         }
//       }, [selectedImage]);
    
//       const handleResearchTopicsChange = (event) => {
//         const value = event.target.value;
//         const topicsArray = value.split(/,\s*/).map((topic) => topic.trim());
//         setResearchTopics(topicsArray);
//       };
    
//       useEffect(() => {
//         async function fetchNames() {
//           const response = await fetch("http://localhost:5000/api/list-lecturers");
//           const data = await response.json()
//           const simplifiedLecturers = await data.map(({ name, email }) => ({ name, email }));
//           console.log(simplifiedLecturers)
//           setLecturerNames(simplifiedLecturers);
//         }
//         fetchNames();
//       }, []);

//       const handleSubmit = (e) => {
//         e.preventDefault();
//         //Either show errors for radio = "yes" or radio = "no"
//         if(selectedOption == "yes"){
//           if(!selectedName){
//             setErrors({dropDown: "Please select an option"})
//             return
//           }
//         }else{
//           if (!selectedImage) {
//             setErrors({ image: "Profile Picture is required" });
//             return;
//           }
//           if (!name) {
//             setErrors({ name: "Name is required" });
//             return;
//           }
//           if (!email) {
//             setErrors({ email: "Email is required" });
//             return;
//           }
//           if (!designation) {
//             setErrors({ designation: "Designation is required" });
//             return;
//           }
//           if (!institution) {
//             setErrors({ institution: "Institution cannot be empty" });
//             return;
//           }
//           if (researchTopics.length === 0) {
//             setErrors({ researchTopics: "Research Fields cannot be empty" });
//             return;
//           }
//         }
//         nextStep();
//       };

//     return (
//       <div className="w-full">
//         <form className="bg-white shadow-md  px-24 pt-16 pb-10 mb-8 rounded-md">
//           <div className="grid gap-4 place-content-center items-center">
//             <h1 className="text-gray-700 pb-8 font-bold text-2xl">Guest Info</h1>
//           </div>
//             <div className="mb-4">
//             <span className="text-gray-800 font-bold">
//                 Existing Guest Lecturer?
//             </span>
//             <div className="mt-2">
//                 <div className="flex items-center">
//                 <input
//                     className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-black-300 ml-5"
//                     id="yes"
//                     type="radio"
//                     value="yes"
//                     name="existingLecturer"
//                     // onChange={handleRadioChange}
//                 />
//                 <label
//                     htmlFor="yes"
//                     className="ml-3 block text-sm font-medium text-gray-700"
//                 >
//                     Yes
//                 </label>
//                 </div>
//                 <div className="flex items-center mt-2">
//                 <input
//                     id="no"
//                     name="existingLecturer"
//                     type="radio"
//                     value="no"
//                     defaultChecked={true}
//                     // onChange={handleRadioChange}
//                     className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-black-300 ml-5"
//                 />
//                 <label
//                     htmlFor="no"
//                     className="ml-3 block text-sm font-medium text-gray-700"
//                 >
//                     No
//                 </label>
//                 </div>
//             </div>
//             {/* {errors.radio && <p className="text-red-500">{errors.radio}</p>} */}
//             </div>
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="Name"
//             >
//               Name
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
//               id="name"
//               name="name"
//               type="text"
//               placeholder="Name"
//               onChange={onChange}
//               value={formValues.name}
//             ></input>
//           </div>
//           <div className="mb-6">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="LastName"
//             >
//               LastName
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="lastname"
//               name="lastname"
//               onChange={onChange}
//               value={formValues.lastname}
//               type="text"
//               placeholder="LastName"
//             ></input>
//           </div>
//           <div className="flex items-center justify-between"></div>
//         </form>
//         <p className="text-center text-gray-500 text-xs">
//           &copy;2022 Form Stepper. All rights reserved.
//         </p>
//       </div>
//     );
//   };

// export default Form1
import React from 'react'

const Form1 = () => {
  return (
    <div>Form1</div>
  )
}

export default Form1