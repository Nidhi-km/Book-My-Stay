import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CHome from "./pages/customer/CHome.jsx";
import CSignIn from "./pages/customer/CSignIn.jsx";
import CSignUp from "./pages/customer/CSignUp.jsx";
import OHome from "./pages/owner/OHome.jsx";
import OSignIn from "./pages/owner/OSignIn.jsx";
import OSignUp from "./pages/owner/OSignUp.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import AllResorts from "./pages/customer/AllResorts.jsx";
import Resort from "./pages/customer/Resort.jsx";
import AddResort from "./pages/owner/AddResort.jsx";
import UploadImg from "./pages/owner/UploadImg.jsx";
import UserProfile from "./pages/customer/UserProfile.jsx";
import OwnerResorts from "./pages/owner/OwnerResorts.jsx";
import UpdateResort from "./pages/owner/UpdateResort.jsx";
import Booking from "./pages/customer/Booking.jsx";
import ResortBooked from "./pages/owner/ResortBooked.jsx";
import MyBookings from "./pages/customer/MyBookings.jsx";



function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* Customer Routes */}
          <Route path="/" element={<CHome />} />
          <Route path="/customer/signin" element={<CSignIn />} />
          <Route path="/customer/signup" element={<CSignUp />} />
          <Route path="/customer/resorts" element={<AllResorts />} />
          <Route path="/customer/resort/:resortId" element={<Resort />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/customer/resort/booking/:resortId" element={<Booking />} />
          <Route path="/customer/mybookings" element={<MyBookings/>}/>



          {/* Owner Routes */}
          <Route path="/owner/home" element={<OHome />} />
          <Route path="/owner/signin" element={<OSignIn />} />
          <Route path="/owner/signup" element={<OSignUp />} />
          <Route path="/owner/addresort" element={<AddResort />} />
          <Route path="/owner/resorts/:id" element={<OwnerResorts />} />
          <Route path="/resort/update/:resortId" element={<UpdateResort />} />
          <Route path="/uploadImg/:resortId" element={<UploadImg />} />
          <Route path="/owner/bookings" element={<ResortBooked />} />

        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster containerClassName="text-[0.8rem] font-outfit" />
    </QueryClientProvider>
  );
}

export default App;
