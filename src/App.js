import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NavBar } from "./components/NavBar";
import { Category } from "./pages/Category";
import { ContactLandlord } from "./pages/ContactLandlord";
import { CreateListing } from "./pages/CreateListing";
import { EditListing } from "./pages/EditListing";
import { Explore } from "./pages/Explore";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Listing } from "./pages/Listing";
import { Offers } from "./pages/Offers";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

function App() {
  return (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Explore/>} />
        <Route path="/offers" element={<Offers/>}/>
        <Route path="/category/:categoryName" element={<Category/>}/>
        <Route path="/category/:categoryName/:listingId" element={<Listing/>}/>
        <Route path="/contact/:landlordId" element={<ContactLandlord/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/createlisting' element={<CreateListing/>}/>
        <Route path='/editlisting/:listingId' element={<EditListing/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/forgotpass" element={<ForgotPassword/>}/>
      </Routes>
      <NavBar/>
    </Router>
    <ToastContainer />
  </>
  );
}

export default App;
