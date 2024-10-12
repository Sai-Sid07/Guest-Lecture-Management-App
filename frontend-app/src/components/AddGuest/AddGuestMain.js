import React from 'react'
import { useState } from 'react'
import EditProfile from './EditProfile'
import EditLecture from './EditLecture'
import EditSchedule from './EditSchedule'
import { TiTick } from "react-icons/ti";
import "./AddGuestMain.css"
import EditItinary from './EditItinary'

const AddGuest = () => {
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState();
    const [imageURL, setImageURL] = useState("https://via.placeholder.com/60x60")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [designation, setDesignation] = useState("")
    const [lecture, setLecture] = useState("")
    const [researchTopics, setResearchTopics] = useState([]);
    const [startDate, setStartDate] = useState(null); 
    const [location, setLocation] = useState("");
    const [duration, setDuration] = useState("");
    const [supportingLecturers, setSupportingLecturers] = useState([])
    const [endDate, setEndDate] = useState(null);
    const [institution, setInstitution] = useState("")
    const [aboutSpeech, setAboutSpeech] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [selectedName, setSelectedName] = useState(""); //If an existing lecture comes for the talk
    const [selectedOption, setSelectedOption] = useState("no"); //For the radio button
    const [startDestination, setStartDestination] = useState('')
    const [numberOfDays, setNumberOfDays] = useState(1);
    

    //Start by assuming admin will not fill the form - alternative is the admin enters a new lecturers details
    const [filledForm, setFilledForm] = useState(true);

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)
    
    const values = {
        imageURL,
        selectedImage,
        name,
        email,
        designation,
        researchTopics,
        aboutSpeech,
        lecture,
        location,
        duration,
        supportingLecturers,
        institution,
        endDate,
        duration, 
        startTime,
        endTime,
        startDate,
        numberOfDays
    }

    const setForm = (e) => {
      const name = e.target.innerText
      switch (name){
        case "Guest Info" : {
          return setStep(1)
        }
        case "Lecture Info" : {
          return setStep(2)
        }
        case "Slot Allotment" : {
          return setStep(3)
        }
        case "Travel and Accomodation" : {
          return setStep(4)
        }
        default: 
          setStep(1)
      }
    }

    const steps = ["Guest Info", "Lecture Info", "Slot Allotment", "Accomodation"];
    const [complete, setComplete] = useState(false);

    //Refactor code to pass value as a param and get value from values 
    //instead of passing each value separately

    return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-1/2 mt-8 p-8 bg-white-200 rounded-lg shadow-lg">
            <div className="flex justify-center mb-5">
        {steps?.map((currentStep, i) => (
          <div
            key={i}
            className={`step-item ${step === i + 1 && "active"} ${
              (i + 1 < step || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < step || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{currentStep}</p>
          </div>
        ))}
      </div>
            {step === 1 && (
              <EditProfile
                filledForm={filledForm}
                setFilledForm={setFilledForm}
                nextStep={nextStep}
                imageURL={imageURL}
                setImageURL={setImageURL}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                designation={designation}
                setDesignation={setDesignation}
                researchTopics={researchTopics}
                setResearchTopics={setResearchTopics}
                institution={institution}
                setInstitution={setInstitution}
                selectedName={selectedName}
                setSelectedName={setSelectedName}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            )}
            {step === 2 && (
              <EditLecture
                prevStep={prevStep}
                nextStep={nextStep}
                lecture={lecture}
                setLecture={setLecture}
                location={location}
                setLocation={setLocation}
                supportingLecturers={supportingLecturers}
                setSupportingLecturers={setSupportingLecturers}
                aboutSpeech={aboutSpeech}
                values={values}
                setAboutSpeech={setAboutSpeech}
              />
            )}
            {step === 3 && (
              <EditSchedule
                filledForm={filledForm}
                prevStep={prevStep}
                nextStep={nextStep}
                duration={duration}
                setDuration={setDuration}
                values={values}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                numberOfDays={numberOfDays}
                setNumberOfDays={setNumberOfDays}
              />
            )}
            {step === 4 && (
              <EditItinary
              startDestination={startDestination}
              setStartDestination={setStartDestination}
              values={values}
              setComplete={setComplete}
              filledForm={filledForm}
              />
            )
            }
          </div>
        </div>
    );
}

export default AddGuest

            {/* <h1 className="text-3xl font-bold text-center mb-8">
              Add Guest Lecturer Details
            </h1> */}
            {/* <ul className="flex justify-between w-full">
            <li
              onClick={setForm}
              className={
                step === 1 ? "bg-blue-300 w-[30%] rounded-lg  " : "bg: transparent"
              }
            >
              <div className="flex items-center">
                <span className="stepper-head-icon">
                  {" "}
                  <svg
                    className="h-12 w-12 text-blue-200"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <line x1="12" y1="12" x2="12" y2="12.01" />{" "}
                    <path
                      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
                      transform="rotate(45 12 12)"
                    />{" "}
                    <path
                      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
                      transform="rotate(-45 12 12)"
                    />
                  </svg>
                </span>
                <span
                  className={
                    step === 1
                      ? "ml-2 text-white font-medium text-lg"
                      : "ml-2 text-blue-300 cursor-pointer"
                  }
                >
                  Guest Info
                </span>
              </div>
            </li>
            <li
              onClick={setForm}
              className={
                step === 2 ? "bg-blue-300 w-[30%] rounded-lg" : "bg: transparent "
              }
            >
              <div className="flex items-center">
                <span className="stepper-head-icon">
                  {" "}
                  <svg
                    className="h-12 w-12 text-blue-200"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <line x1="12" y1="12" x2="12" y2="12.01" />{" "}
                    <path
                      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
                      transform="rotate(45 12 12)"
                    />{" "}
                    <path
                      d="M12 2a4 10 0 0 0 -4 10a4 10 0 0 0 4 10a4 10 0 0 0 4 -10a4 10 0 0 0 -4 -10"
                      transform="rotate(-45 12 12)"
                    />
                  </svg>
                </span>
                <span
                  className={
                    step === 2
                      ? "ml-2 text-white font-medium text-lg"
                      : "ml-2 text-blue-300 cursor-pointer"
                  }
                >
                  Lecture Info{" "}
                </span>
              </div>
            </li>
          </ul> */}