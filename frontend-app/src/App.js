//AGLES: Amrita Guest Lecture and Engagement System
import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { UserContextProvider } from "./context/UserContext";
import { EventContextProvider } from './context/EventContext';
import { SkeletonTheme } from 'react-loading-skeleton';

// Main Imports
import Account from './components/Account'
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Events from './components/Events';
import AddStudent from './components/AddStudent';
import AddGuest from './components/AddGuest/AddGuestMain';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Error from './components/Error';
import Home from "./components/Home"
import PhoneSignIn from './components/PhoneSignIn';
import StudentProfile from './components/StudentProfile';
import Resources from './components/Resources';
import Comments from './components/Comments/Comments';
import ForgotPassword from './components/ForgotPassword';
import Fetching from './components/Fetching';
import Accomodation from './components/Accomodation';
import FetchResource from './components/FetchResource';


//Temporary Imports
// import MultistepForm from './components/Steps/Parent';
// import AddGuestMain from './components/AddGuest/AddGuestMain';
// import DateTimeForm from './components/Temp/Temp';
// import ProfileEdit from './components/Temp/ProfileEdit';
// import Example from './components/Temp/AddGuest';
// import SignUp from './components/SignUp'

//Add a landing page
//Add a loading page
//Add Lazy Loading and React Suspense along with a fallback which goes to react loading page


function App() {
  return (
    <div>
      <AuthContextProvider>
        <UserContextProvider>
          <EventContextProvider>
            <NavBar/>
            <SkeletonTheme baseColor="#E5E5E6" highlightColor="#E6E5E5">
              <Routes>
                  {/* Final Routes */}
                  <Route path="/" element={<Home/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/signup' element={<SignUp />}/>
                  <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                  <Route path="/viewEvents" element={<ProtectedRoute><Events/></ProtectedRoute>}/>
                  <Route path="/createStudent" element={<ProtectedRoute><AddStudent/></ProtectedRoute>}/>
                  <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>}/>
                  <Route path="/addGuest" element={<AddGuest/>}/>
                  <Route path="/profile" element={<Profile/>}/>
                  <Route path="/phone" element={<PhoneSignIn/>}/>
                  <Route path='/profile-student' element={<StudentProfile/>}/>
                  <Route path="/resources" element={<Resources/>}/>
                  <Route path="/queries" element={<Comments/>}/>
                  <Route path='/generateReport' element={<FetchResource/>}/>
                  <Route path='/temp' element={<Accomodation/>}/>


                  {/* <Route path='/navbar' element={<NavBar/>}/> */}
            
                  {/* Temporary paths - Will be deleted after finanlization */}
                  {/* <Route path="/create" element={<SignUp/>}/>
                  <Route path="/sample" element={<ProfileEdit/>}/>
                  <Route path="/addGuest" element={<AddGuestMain/>}/>
                  <Route path="/temp" element={<MultistepForm/>}/>
                  <Route path="/addGuestNew" element={<Example/>}/>
                  <Route path="temp2" element={<DateTimeForm/>}/> */}
                  {/* <Route path="/lecturer" element={<GuestProfile/>}/> */}
                  <Route path="/*" element={<Error/>} />
              </Routes>
            </SkeletonTheme>
          </EventContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;