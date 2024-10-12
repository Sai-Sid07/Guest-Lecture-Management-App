import React from "react";
import Card from "./Card";
import { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { UserContext } from "../context/UserContext";
import { EventData } from "../context/EventContext";
import { useLocation } from "react-router-dom";
import NoData from "./NoData";

const Events = (props) => {
  const [title, setTitle] = useState("")
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const { userType, userEmail } = useContext(UserContext);
  const {eventsData, setEventsData} = EventData()
  const location = useLocation()
  const [viewPast, setViewPast] = useState()

  useEffect(() => {
    console.log("Location.state changed")
    console.log(location.state)
    setViewPast(location.state?.pastEvent)
  }, [location.state])

  useEffect(() => {
    if(viewPast){
      setTitle("Past Events")
    }else{
      setTitle("Upcoming Events")
    }
  }, [viewPast])


  useEffect(() => {
    async function fetchEvents() {
      console.log(userType)
      if(userType === "admin" || userType === "student"){
        const response = await fetch("http://localhost:5000/api/events/temp");
        const combinedData = await response.json(); 
        setEvents(combinedData); 
        setEventsData(combinedData)
      }else{
        console.log("In here in else")
        console.log(userEmail)
        const response = await fetch(`http://localhost:5000/api/events/:${userEmail}`);
        const combinedData = await response.json(); 
        setEvents(combinedData);
        setEventsData(combinedData)
      }
    }
      fetchEvents();
  }, []);

  useEffect(() => {
    console.log(events)
    const today = moment().startOf('day');
    //Filtering events based on current date
    const pastEventsList = events
      .filter((event) => moment(event.startDate, 'DD-MM-YYYY').isBefore(today))
      .map((event) => ({
        dateStart: moment(event.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        ...event,
      }));
    const futureEventsList = events
      .filter((event) => moment(event.startDate, 'DD-MM-YYYY').isSameOrAfter(today))
      .map((event) => ({
        dateStart: moment(event.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        ...event,
      }));
    setPastEvents(pastEventsList);
    setFutureEvents(futureEventsList);
  }, [events]);

  return (
    <>
    {console.log(eventsData)}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl text-gray-500 font-semibold">
            {title === "Upcoming Events" ? (
              futureEvents.length === 0 ? "" : title + " (" + futureEvents.length + ")"
            ) : pastEvents.length === 0 ? "" : title + " (" + pastEvents.length + ")"}
            {/* {count > 0 ? "(" + count + ")" : <Skeleton />} */}
            {/* Upcoming Events */}
            {console.log("Past events: ", pastEvents)}
            {console.log("View Past: ", viewPast)}
          </h2>
        <div className="flex flex-wrap justify-center gap-0">
          {viewPast && pastEvents.length === 0 ? (
            <NoData/>
          ) : (
            (viewPast && pastEvents.map((pastEvent, index) => (
              <div key={index} className="w-1/4">
                <Card data={pastEvent}/>
              </div>
            )))
          )}
          {!viewPast && futureEvents.length === 0 ? (
            <NoData/>
          ) : (
            (!viewPast && futureEvents.map((futureEvent, index) => (
              <div key={index} className="w-1/4">
                <Card data={futureEvent}/>
              </div>
            )))
          )}
        </div>
      </div>
    </>
  );
};

export default Events;
