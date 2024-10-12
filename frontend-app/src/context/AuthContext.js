import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    sendPasswordResetEmail
    } from "firebase/auth"
import { auth } from "../firebase";
//signInWithPhoneNumber
const UserContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const sendResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const setUpRecaptcha = (number) => {
        const recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {},
          auth
        );
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, number, recaptchaVerifier);
      }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            //currentUser is a variable given by Firebase which
            //contains all the logged in user's data
            console.log(currentUser)
            setUser(currentUser)
            console.log(user)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        // The value property is where we export our functions
        <UserContext.Provider value={{createUser, user, logout, signIn, setUpRecaptcha, sendResetEmail}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext);
}