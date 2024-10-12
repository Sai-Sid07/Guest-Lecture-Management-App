import React from 'react'
import { useState } from "react";
import SuccessScreen from "./SuccessScreen"
import { UserAuth } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const EditItinary = ({
    prevStep,
    startDestination,
    setStartDestination,
    filledForm,
    values,
    setComplete

}) => {

    const [errors, setErrors] = useState({});
    const { createUser, logout, signIn } = UserAuth();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        //Form Validation
        console.log("In Here Submit Function");
        e.preventDefault();
        if (!startDestination) {
        setErrors({ startDestination: "Start Destination cannot be empty" });
            return;
        }

        const formDataGuest = new FormData();
        const formDataEvent = new FormData();

        console.log("Destination - ", startDestination)
        console.log("Date - ", values.startDate)

        formDataGuest.append("name", values.name);
        formDataGuest.append("email", values.email);
        formDataGuest.append("designation", values.designation);
        formDataGuest.append("image", values.selectedImage);
        formDataGuest.append("institution", values.institution);
        formDataGuest.append("researchTopics", values.researchTopics);

        formDataEvent.append("lecture", values.lecture);
        formDataEvent.append("aboutSpeech", values.aboutSpeech);
        formDataEvent.append("startDate", values.startDate);
        formDataEvent.append("endDate", values.endDate);
        formDataEvent.append("duration", values.duration);
        formDataEvent.append("location", values.location);
        formDataEvent.append("startTime", values.startTime);
        formDataEvent.append("endTime", values.endTime);
        formDataEvent.append("numberOfDays", values.numberOfDays);
        formDataEvent.append("lecturerName", values.name);
        formDataEvent.append("lecturerEmail", values.email);
        formDataEvent.append("startDestination", startDestination);
        if (values.supportingLecturers) {
        formDataEvent.append("supportingLecturers", values.supportingLecturers);
        }

        try {
            console.log("In First Try block of Submit - adding guest");
            setComplete(true);
            if (filledForm) {
              // Create a guest-lecture account in firebase simultaneously
              console.log("Guest E-Mail: ",values.email)
              const guest_email = "guest_" + values.email;
              const guest_password = "guest@001"; // They can reset this if they want
              try {
                await createUser(guest_email, guest_password);
                try {
                  await logout();
                  try {
                    await signIn("admin@admin.com", "admin@Amrita");
                  } catch (e) {
                    setErrors(e.message);
                    console.log(e);
                  }
                } catch (e) {
                  setErrors(e.message);
                  console.log(e);
                }
              } catch (e) {
                setErrors(e.message);
                console.log(e.message);
              }
      
              const response_guest = await fetch(
                "http://localhost:5000/api/add-guest-lecturers",
                {
                  method: "POST",
                  body: formDataGuest,
                }
              );
              console.log(response_guest);
              if (response_guest.ok) {
                console.log("Successfully added Guest Lecture Details");
              } else {
                throw new Error(
                  "An error occurred while saving the guest lecturer details."
                );
              }
            }
      
            // Process event data
            for (var pair of formDataEvent.entries()) {
              console.log(pair[0] + ", " + pair[1]);
            }
      
            try {
              console.log("Inside 2nd try block - add event to DB");
              const response_event = await fetch(
                "http://localhost:5000/api/addEvent",
                {
                  method: "POST",
                  body: formDataEvent,
                }
              );
              if (response_event.ok) {
                console.log("Successfully updated DB");
                //Move it to the point guest email is created
                setIsSuccess(true);
              } else {
                throw new Error("An error occurred while saving the event details.");
              }
            } catch (error) {
              console.error(error);
              alert(error.message);
            }
          } catch (error) {
            console.error(error);
            alert(error.message);
          }
    }

  return (
    <div>
      {!isSuccess ? (
        // Edit Schedule
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center pb-5">
            <h1 className="text-gray-700 font-bold text-2xl">Travel and Accomodation</h1>
          </div>
          <div className="mb-4  relative mt-4">
          <label
            className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            htmlFor="startDestination"
          >
            Departure Destination
          </label>
          <input
            className={`${
              errors.lecture
                ? "border-red-500 border-2"
                : "border-blue-500 border-2"
            }
                shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            id="startDestination"
            type="text"
            placeholder="Enter start destination of Guest"
            value={startDestination}
            onChange={(e) => {
                setStartDestination(e.target.value);
            }}
          />
          {errors.startDestination && <p className="text-red-500">{errors.startDestination}</p>}
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
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              // disabled={!scheduled}
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (
        <SuccessScreen />
      )}
    </div>
  )
}

export default EditItinary