import React, { createContext, useState, useContext } from "react";

export const EventContext = createContext();
const storedEventData = localStorage.getItem('eventData');
const storedEventsData = localStorage.getItem('eventsData');

export const EventContextProvider = ({ children }) => {
  const [event, setEvent] = useState(storedEventData || null);
const [eventsData, setEvents] = useState(storedEventsData || null)

  const setEventData = (eventObject) => {
    setEvent(eventObject);
    console.log(eventObject)
    localStorage.setItem('eventData', eventObject);
  };

  const setEventsData = (events) => {
    setEvents(events);
    console.log(events)
    localStorage.setItem("eventsData", events)
  }

  return (
    <EventContext.Provider value={{ event, setEventData, eventsData, setEventsData }}>
      {children}
    </EventContext.Provider>
  );
};

export const EventData = () => {
    return useContext(EventContext)
}