// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbgKGOyjsghjcIKKUxdGdCaYF8LDUSPGc",
  authDomain: "guest-lecture-auth.firebaseapp.com",
  projectId: "guest-lecture-auth",
  storageBucket: "guest-lecture-auth.appspot.com",
  messagingSenderId: "551656502199",
  appId: "1:551656502199:web:2f6f0298e40389b0f72e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app