import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext();
const storedUserType = localStorage.getItem('userType');
const storedUserEmail = localStorage.getItem('userEmail')
const storedStudentName = localStorage.getItem("studentName")

export const UserContextProvider = ({ children }) => {
  const [userType, setUserType] = useState(storedUserType || null);
  const [userEmail, setEmail] = useState(storedUserEmail || null);
  const [studentName, setStudentName] = useState(storedStudentName || null)

  const setUser = (type) => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const setUserEmail = (email) => {
    setEmail(email);
    localStorage.setItem('userEmail', email)
  }

  const setStudent = (name) => {
    setStudentName(name);
    localStorage.setItem("studentName", name)
  }

  return (
    <UserContext.Provider value={{ userType, setUser, userEmail, setUserEmail, setStudent, studentName }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserType = () => {
    return useContext(UserContext)
}