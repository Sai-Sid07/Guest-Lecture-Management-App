import React from "react";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SuccessScreen from "./SuccessScreen"
import { UserAuth } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const EditSchedule = ({
  prevStep,
  nextStep,
  duration,
  setDuration,
  values,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filledForm,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  numberOfDays,
  setNumberOfDays
}) => {
  const [errors, setErrors] = useState({});
  const { createUser, logout, signIn } = UserAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  // const [guestData, setGuestData] = useState({});
  const [scheduled, setScheduled] = useState(false); //Needed to disable submit button when not scheduled
  const [tempDate, setTempDate] = useState(null)
  //Test code to check if date and duration is printing
  // useEffect(() => {
  //   console.log(duration)
  //   console.log(selectedDate)
  // }, [startDate, duration])

  const handleCheckSchedule = async (e) => {
    //Calling the scheduler
    e.preventDefault();
    if (!tempDate) {
      setErrors({ tempDate: "Event Date is required" });
      return;
    }
    if (!duration) {
      setErrors({ duration: "Specify Duration of Event" });
      return;
    }
    if (!numberOfDays) {
      setErrors({ numberOfDays: "Number of Days cannot be empty" });
      return;
    }
    setErrors("");
    console.log("Calling Scheduler");
    const dateToBeScheduled = tempDate;
    console.log("Date Picked: ",dateToBeScheduled)
    const duration_event = duration;
    const schedulerCheck = new FormData();

    schedulerCheck.append("dateToBeScheduled", dateToBeScheduled);
    schedulerCheck.append("duration_event", duration_event);
    schedulerCheck.append("numberOfDays", numberOfDays);
    // const object = {
    //   dateToBeScheduled: dateToBeScheduled,
    //   duration_event: duration_event,
    // };
    try {
      const response = await fetch(`http://localhost:5000/api/scheduler`, {
        method: "POST",
        body: schedulerCheck,
      });
      const data = await response.json();
      if (data) {
        //Add a sidebar notification telling event successfully scheduled
        setStartTime(data.startTime)
        setEndTime(data.endTime)
        setStartDate(data.startDate)
        setEndDate(data.endDate)
        alert("Successfully Scheduled")
        setScheduled(true)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    console.log("In Here Submit Function");
    e.preventDefault();
    if (!tempDate) {
      setErrors({ tempDate: "Event Date is required" });
      return;
    }
    if (!duration) {
      setErrors({ duration: "Specify Duration of Event" });
      return;
    }
    if (!numberOfDays) {
      setErrors({ numberOfDays: "Number of Days cannot be empty" });
      return;
    }

    console.log("Scheduled Date and Time")
    console.log("Date:", startDate)
    console.log("Start Time: ", startTime)
    console.log("End Time: ", endTime)
    console.log("Duration: ", duration)
    nextStep();

    console.log(startDate)
    console.log(endDate)
    // const formDataGuest = new FormData();
    // const formDataEvent = new FormData();

    // formDataGuest.append("name", values.name);
    // formDataGuest.append("email", values.email);
    // formDataGuest.append("designation", values.designation);
    // formDataGuest.append("image", values.selectedImage);
    // formDataGuest.append("institution", values.institution);
    // formDataGuest.append("researchTopics", values.researchTopics);

    // formDataEvent.append("lecture", values.lecture);
    // formDataEvent.append("aboutSpeech", values.aboutSpeech);
    // formDataEvent.append("startDate", startDate);
    // // formDataEvent.append("endDate", endDate);
    // formDataEvent.append("duration", values.duration);
    // formDataEvent.append("location", values.location);
    // formDataEvent.append("startTime", startTime);
    // formDataEvent.append("endTime", endTime);
    // formDataEvent.append("lecturerName", values.name);
    // formDataEvent.append("lecturerEmail", values.email);
    // if (values.supportingLecturers) {
    //   formDataEvent.append("supportingLecturers", values.supportingLecturers);
    // }

    // console.log("Scheduled Date and Time")
    // console.log("Date:", startDate)
    // console.log("Start Time: ", startTime)
    // console.log("End Time: ", endTime)
    // //Calculating number of days the event is going to go on
    // // const start = moment(`${startDate}`);
    // // const end = moment(`${endDate}`);
    // // const diffInDays = end.diff(start, "days") + 1; //Adding 1 to include both start and end.
    // // const roundedDiff = Math.round(diffInDays);
    // // formDataEvent.append("numberOfDays", roundedDiff);
    // //Before pushing it to DB, schedulability is checked and the start and end time is mentioned.
    // //Then only values are pushed into DB

    // try {
    //   console.log("In First Try block of Submit - adding guest");
    //   setComplete(true);
    //   if (filledForm) {
    //     // Create a guest-lecture account in firebase simultaneously
    //     console.log("Guest E-Mail: ",values.email)
    //     const guest_email = "guest_" + values.email;
    //     const guest_password = "guest@001"; // They can reset this if they want
    //     try {
    //       await createUser(guest_email, guest_password);
    //       try {
    //         await logout();
    //         try {
    //           await signIn("admin@admin.com", "admin@Amrita");
    //         } catch (e) {
    //           setErrors(e.message);
    //           console.log(e);
    //         }
    //       } catch (e) {
    //         setErrors(e.message);
    //         console.log(e);
    //       }
    //     } catch (e) {
    //       setErrors(e.message);
    //       console.log(e.message);
    //     }

    //     const response_guest = await fetch(
    //       "http://localhost:5000/api/add-guest-lecturers",
    //       {
    //         method: "POST",
    //         body: formDataGuest,
    //       }
    //     );
    //     console.log(response_guest);
    //     if (response_guest.ok) {
    //       console.log("Successfully added Guest Lecture Details");
    //     } else {
    //       throw new Error(
    //         "An error occurred while saving the guest lecturer details."
    //       );
    //     }
    //   }

    //   // Process event data
    //   for (var pair of formDataEvent.entries()) {
    //     console.log(pair[0] + ", " + pair[1]);
    //   }

    //   try {
    //     console.log("Inside 2nd try block - add event to DB");
    //     const response_event = await fetch(
    //       "http://localhost:5000/api/addEvent",
    //       {
    //         method: "POST",
    //         body: formDataEvent,
    //       }
    //     );
    //     if (response_event.ok) {
    //       console.log("Successfully updated DB");
    //       //Move it to the point guest email is created
    //       setIsSuccess(true);
    //     } else {
    //       throw new Error("An error occurred while saving the event details.");
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     alert(error.message);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert(error.message);
    // }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center pb-5">
            <h1 className="text-gray-700 font-bold text-2xl">Lecture Info</h1>
            <div className="group ml-5">
              <FontAwesomeIcon icon={faCircleInfo} />
              <span className="absolute max-w-xs ml-[8px] mt-[-15px]  scale-0 transition-all rounded delay-75 break-words bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                Only enter the date and duration of the event. The event will
                get scheduled automatically either on the requested date or the
                next available date.
              </span>
            </div>
          </div>
          <div className="mb-4 relative mt-4">
            <label
              className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold z-20"
              htmlFor="date-of-speech-start"
            >
              Tentative Date
            </label>
            <DatePicker
              autoComplete="new-password"
              id="date-of-speech-start"
              selected={tempDate}

              placeholdertext="Start date of Lecture : dd/mm/yyyy"
              onChange={(date) => {
                setTempDate(date);
              }}
              dateFormat="dd-MM-yyyy"
              className={`${
                errors.tempDate
                  ? "border-red-500 border-2"
                  : "border-blue-500 border-2"
              }
                  shadow-sm bg-white rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full`}
            />
            {errors.tempDate && (
              <p className="text-red-500">{errors.tempDate}</p>
            )}
          </div>
          
          <div className="flex flex-row mb-4 relative mt-4">
            <label
              htmlFor="numberInput"
              className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            >
              Duration of Lecture
            </label>
            <input
              type="number"
              id="numberInput"
              placeholdertext="Set duration of Lecture"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                setErrors("");
              }}
              min="1"
              step="1"
              max="3"
              className={`${
                errors.duration
                  ? "border-red-500 border-2"
                  : "border-blue-500 border-2"
              }
              shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-3/4`}
            />
          </div>
          <div className="mb-3">
            {errors.duration && (
              <p className="text-red-500">{errors.duration}</p>
            )}
            {duration && <p>This event will last for {duration} hours</p>}
          </div>

          <div className="flex flex-row mb-4 relative mt-4">
            <label
              htmlFor="numberOfDays"
              className="absolute left-2 -top-3 bg-white px-1 text-gray-700 font-semibold"
            >
              Number of Days
            </label>
            <input
              type="number"
              id="numberOfDays"
              placeholdertext="Number of Days of Lecture"
              value={numberOfDays}
              onChange={(e) => {
                setNumberOfDays(e.target.value);
                setErrors("");
              }}
              min="1"
              step="1"
              max="3"
              className={`${
                errors.numberOfDays
                  ? "border-red-500 border-2"
                  : "border-blue-500 border-2"
              }
              shadow-sm rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-3/4`}
            />
          </div>
          <div className="mb-3">
            {errors.numberOfDays && (
              <p className="text-red-500">{errors.numberOfDays}</p>
            )}
            {numberOfDays && <p>This event will go on for {numberOfDays} day(s)</p>}
          </div>
          {scheduled ? (
            <button
              className="w-[20%] mb-4 bg-green-500 text-white rounded-md py-2 px-4"
              type="button"
            >
              Scheduled
             </button>

          ) : (
            <button
              className="w-[15%] mb-4 bg-blue-500 text-white rounded-md py-2 px-4"
              onClick={handleCheckSchedule}
            >
              Schedule
          </button>
          )}
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
              // disabled={!scheduled}
            > 
              Next
            </button>
          </div>
        </form>
    </div>
  );
};

export default EditSchedule;
