import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, PlusCircle, Building2, LogOut, User, ClipboardList } from "lucide-react";
import { LogIn, UserPlus } from "lucide-react";

const CNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const brandImage = "https://cdn-icons-png.flaticon.com/512/684/684908.png";
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("profile");
        setIsLoggedIn(false);
        navigate("/owner/home");
    };

    return (

        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">

                {/* Brand Logo */}
                <Link to="/owner/home" className="flex items-center gap-2">
                    <img
                        src={brandImage}
                        alt="Resort"
                        className="w-10 h-10 rounded-full border-2 border-[#F5C518] object-cover"
                    />
                    <span className="font-semibold text-2xl text-[#0A2647]">
                        Resort<span className="text-[#F5C518]">Hub</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-[#0A2647] font-medium">


                    {!isLoggedIn ? (
                        <>

                            <Link to="/owner/home" className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200">
                                <Home size={18} /> Home
                            </Link>

                            <Link to="/owner/signin" className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200">
                                <LogIn size={18} /> Sign In
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/owner/home" className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200">
                                <Home size={18} /> DashBoard
                            </Link>
                            

                            <Link to="/profile" className="flex items-center gap-2 hover:text-[#F5C518] transition-all duration-200">
                                <User size={18} /> Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-[#0A2647] hover:text-[#F5C518]"
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 flex flex-col items-center gap-3 py-3 text-[#0A2647] font-medium">
                    <Link to="/owner/home" onClick={() => setIsOpen(false)} className="hover:text-[#F5C518] flex items-center gap-1">
                        <Home size={18} /> Home
                    </Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/owner/signin" onClick={() => setIsOpen(false)} className="hover:text-[#F5C518] flex items-center gap-1">
                                <LogIn size={18} /> Sign In
                            </Link>
                            <Link to="/owner/signup" onClick={() => setIsOpen(false)} className="hover:text-[#F5C518] flex items-center gap-1">
                                <UserPlus size={18} /> Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/owner/dashboard" className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200">
                                <Home size={18} /> DashBoard
                            </Link>
                            <Link to="/owner/resorts" className="hover:text-[#F5C518] flex items-center gap-1 transition-all duration-200">
                                <Building2 size={18} /> Manage Resorts
                            </Link>

                            <Link to="/owner/bookings" className="flex items-center gap-2 hover:text-[#F5C518] transition-all duration-200">
                                <ClipboardList size={18} /> Bookings
                            </Link>
                            <Link to="/owner/profile" onClick={() => setIsOpen(false)} className="hover:text-[#F5C518] flex items-center gap-1">
                                <User size={25} /> Profile
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="hover:text-[#F5C518] flex items-center gap-1"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default CNavbar;
