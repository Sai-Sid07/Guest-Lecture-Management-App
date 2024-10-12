import React from "react";
import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import { UserAuth } from '../../context/AuthContext'

const EditLecture = ({
  prevStep,
  nextStep,
  lecture,
  setLecture,
  location,
  setLocation,
  values,
  supportingLecturers,
  setSupportingLecturers,
  setAboutSpeech,
  aboutSpeech,
}) => {
  const [errors, setErrors] = useState({});
  const { createUser, logout, signIn } = UserAuth();
  const [guestData, setGuestData] = useState({});
  //Test code to check if date and duration is printing
  // useEffect(() => {
  //   console.log(duration)
  //   console.log(selectedDate)
  // }, [startDate, duration])

  const handleSupportingLectureChange = (event) => {
    console.log(values.name);
    console.log(values.email);
    console.log(values);
    const value = event.target.value;
    const topicsArray = value.split(/,\s*/).map((topic) => topic.trim());
    setSupportingLecturers(topicsArray);
  };

  const handleSubmit = (e) => {
    console.log("In Here Submit Function");
    e.preventDefault();
    if (!lecture) {
      setErrors({ lecture: "Lecture is required" });
      return;
    }
    if (!aboutSpeech) {
      setErrors({ aboutSpeech: "Description about Lecture cannot be empty" });
      return;
    }
    if (!location) {
      setErrors({ location: "Venue is required" });
      return;
    }
    console.log("Guest Name: ", values.name)
    console.log("Guest Email: ", values.email)
    nextStep();

    //   try {
    //       console.log("In Here");
    //       if (filledForm) {
    //         //Create a guest-lecture account in firebase simultaenously
    //         // const guest_email = 'guest_' + values.email
    //         // const guest_password = "guest@001" //They can reset this if they want
    //         // try{
    //         //   await createUser(guest_email, guest_password)
    //         // }catch(e){
    //         //   setErrors(e.message)
    //         //   console.log(e.message)
    //         // }
    //         const response_guest = await fetch(
    //           "http://localhost:5000/api/add-guest-lecturers",
    //           {
    //             method: "POST",
    //             body: formDataGuest,
    //           }
    //         );
    //         console.log(response_guest);
    //         if (response_guest.ok) {
    //           console.log("Successfully added Guest Lecture Details");
    //         } else {
    //           throw new Error(
    //             "An error occurred while saving the guest lecturer details."
    //           );
    //         }
    //       }
    //       // else {
    //       //     //https://community.postman.com/t/sending-request-with-form-data-failed-it-send-an-empty-object/30414/4
    //       //   const object_guest = await fetch(
    //       //     "http://localhost:5000/api/get-guest-lecturer"
    //       //   );
    //       //   const data = await object_guest.json();
    //       //   console.log(data);
    //       //   setGuestData(data);
    //       //   formDataEvent.append("lecturerName", data.name);
    //       //   formDataEvent.append("lecturerEmail", data.email);
    //       // }
    //       for (var pair of formDataEvent.entries()) {
    //         console.log(pair[0] + ", " + pair[1]);
    //       }

    //       try {
    //         console.log("Inside 2nd try block");
    //         const response_event = await fetch(
    //           "http://localhost:5000/api/addEvent",
    //           {
    //             method: "POST",
    //             body: formDataEvent,
    //           }
    //         );
    //         if (response_event.ok) {
    //           console.log("Successfully updated DB");
    //           setIsSuccess(true);
    //         } else {
    //           throw new Error(
    //             "An error occurred while saving the event details."
    //           );
    //         }
    //       } catch (error) {
    //         console.error(error);
    //         alert(error.message);
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       alert(error.message);
    //     }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 place-content-center items-center">
          <h1 className="text-gray-700 pb-8 font-bold text-2xl">
            Lecture Info
          </h1>
        </div>
        <div className="mb-4  relative mt-4">
          <label
            className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            htmlFor="topic"
          >
            Lecture Topic
          </label>
          <input
            className={`${
              errors.lecture
                ? "border-red-500 border-2"
                : "border-blue-500 border-2"
            }
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            id="topic"
            type="text"
            placeholder="Enter Lecture Topic"
            value={lecture}
            onChange={(e) => {
              setLecture(e.target.value);
            }}
          />
          {errors.lecture && <p className="text-red-500">{errors.lecture}</p>}
        </div>
        <div className="mb-4 relative mt-4">
          <label
            className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            htmlFor="aboutLecture"
          >
            About Lecture
          </label>
          <textarea
            className={`${
              errors.aboutSpeech
                ? "border-red-500 border-2"
                : "border-blue-500 border-2"
            }
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            placeholder="Briefly describe the event..."
            value={aboutSpeech}
            onChange={(e) => {
              setAboutSpeech(e.target.value);
            }}
          />
          {errors.aboutSpeech && (
            <p className="text-red-500">{errors.aboutSpeech}</p>
          )}
        </div>
        <div className="mb-4 relative mt-4">
          <label
            className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            htmlFor="supportingLecturers"
          >
            Supporting Lecturers
          </label>
          <input
            type="text"
            name="supportingLecturers"
            className={`${
              errors.supportingLecturers
                ? "border-red-500 border-2"
                : "border-blue-500 border-2"
            }
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            onChange={handleSupportingLectureChange}
            placeholder="Enter Supporting Lecturer names... (..,..)"
            value={supportingLecturers.join(", ")}
          />
          {errors.supportingLecturers && (
            <p className="text-red-500">{errors.supportingLecturers}</p>
          )}
        </div>
        <div className="mb-4 relative mt-4">
          <label
            className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            htmlFor="location"
          >
            Venue
          </label>
          <select
            className={`${
              errors.location
                ? "border-red-500 border-2"
                : "border-blue-500 border-2"
            }
                  shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          >
            <option value="">Select a location</option>
            <option value="Amriteshwari Hall">
              Amriteshwari Hall (1st Floor)
            </option>
            <option value="Amriteshwari Hall (2nd Floor)">
              Amriteshwari Hall (2nd Floor)
            </option>
            <option value="ASB Hall">ASB Hall</option>
            <option value="AB1 Lecture Hall">AB1 Lecture Hall</option>
          </select>
          {errors.location && <p className="text-red-500">{errors.location}</p>}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Previous
          </button>
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

export default EditLecture;
