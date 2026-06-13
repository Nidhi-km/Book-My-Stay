import { Formik, Form, ErrorMessage } from "formik";
import { Mail, Lock, HomeIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../components/common/Loader.jsx";
import { signinSchema } from "../../formikValidation.js";
import { API_URL } from "../../utils.js";
import { getErrorMessage } from "../../utils.js";
import React from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

const OSignIn = () => {
  const navigate = useNavigate();

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = () => {
    if (!email) return toast.error("Please enter your email");
    toast.success("Email link sent successfully!");
    setShowEmailPopup(false);
    setEmail("");
  };

  const signin = async (val) => {
    const res = await axios.post(`${API_URL}/auth/user/signin`, val);
    return res.data;
  };

  const signinMutation = useMutation({
    mutationFn: signin,
    mutationKey: "user-signin",
    onSuccess: (result) => {
      const { token, user } = result;
      localStorage.setItem("token", token);
      sessionStorage.setItem("profile", JSON.stringify(user.userId));
      toast.success("Logged In Successfully");

      setTimeout(() => {
        navigate("/owner/home");
      }, 300);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F7FA] to-[#E4EBF5] p-4 font-outfit relative">
      {/* 🏠 Back to Home */}
      <button
        onClick={() => navigate("/owner/home")}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#0A2647] font-medium hover:text-[#F5C518] transition-all"
      >
        <HomeIcon size={20} />
      </button>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-[#F5C518]/40">
        <h1 className="text-[#0A2647] font-bold text-3xl text-center mb-2">
          Login
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Welcome back! Please log in to continue
        </p>

        {/*  Formik Sign-in Form */}
        <Formik
          validationSchema={signinSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(val) => signinMutation.mutate(val)}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signinMutation.isLoading}
                className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#F5C518] hover:text-[#0A2647] focus:ring-2 focus:ring-[#F5C518]/70 transition-all flex justify-center items-center gap-2"
              >
                {signinMutation.isLoading ? <Loader /> : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have account?{" "}
          <Link
            to={"/owner/signup"}
            className="text-[#0A2647] font-semibold hover:text-[#F5C518] transition-all"
          >
            Sign Up
          </Link>
        </div>

        {/* Continue Options */}
        {/* <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-16 bg-gray-300"></span>
                        <span className="text-gray-500 text-sm">or continue with</span>
                        <span className="h-px w-16 bg-gray-300"></span>
                    </div>


                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        
                        <button
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                            onClick={() => toast("Google Sign-In coming soon!")}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                        </button>

                       
                        <button
                            onClick={() => setShowEmailPopup(true)}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            <Mail size={18} />
                        </button>

                        <Link to="/owner/signup" className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
                            <UserPlus size={18} /> 
                        </Link>
                    </div>
                </div> */}
      </div>

      {/*  Email Popup */}
      {/* {showEmailPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-white/30 backdrop-blur-md z-50">
                    <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-80 border border-gray-200 relative animate-[fadeIn_0.3s_ease]">
                        <button
                            onClick={() => setShowEmailPopup(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-[#0A2647] transition-all text-xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold text-center text-[#0A2647] mb-4">
                            Enter your Email
                        </h2>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C518] focus:outline-none mb-4"
                        />
                        <button
                            onClick={handleEmailSubmit}
                            className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#08223D] transition-all"
                        >
                            Send Link
                        </button>
                    </div>
                </div>
            )} */}
    </section>
  );
};

export default OSignIn;
