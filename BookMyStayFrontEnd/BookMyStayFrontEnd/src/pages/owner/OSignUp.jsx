import { Formik, Form, ErrorMessage } from "formik";
import { Mail, Lock, ArrowLeft, User, Phone, UserCog } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../components/common/Loader.jsx";
import { signupSchema } from "../../formikValidation.js";
import { API_URL } from "../../utils.js";
import { getErrorMessage } from "../../utils.js";
import { HomeIcon } from "lucide-react";

const OSignUp = () => {
    const navigate = useNavigate();

    const signUp = async (val) => {
        const res = await axios.post(`${API_URL}/auth/user/signup`, val);
        return res.data;
    };

    const signupMutation = useMutation({
        mutationFn: signUp,
        mutationKey: "user-signup",
        onSuccess: (result) => {
            const { token } = result;
            localStorage.setItem("token", token);
            toast.success("Account created successfully");
            setTimeout(() => {
                navigate("/");
            }, 300);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return (
        <section className="min-h-screen flex items-center justify-center bg-white p-4 font-outfit relative">
            {/* Back to Home button */}
            <button
                onClick={() => navigate("/owner/home")}
                className="absolute top-6 left-6 flex items-center gap-2 text-[#0A2647] font-medium hover:text-[#F5C518] transition-all"
            >
                <HomeIcon size={20} />
            </button>
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-[#F5C518]/40">
                <h1 className="text-[#0A2647] font-bold text-3xl text-center mb-2">
                    Create Account
                </h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Sign up to manage your resorts
                </p>

                <Formik
                    validationSchema={signupSchema}
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        phoneNumber: "",
                        role: "RESORT_OWNER",
                    }}
                    onSubmit={(val) => signupMutation.mutate(val)}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form className="space-y-4">
                            {/* Full Name */}
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Phone Number */}
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="phoneNumber" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={signupMutation.isLoading}
                                className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#F5C518] hover:text-[#0A2647] focus:ring-2 focus:ring-[#F5C518]/70 transition-all flex justify-center items-center gap-2"
                            >
                                {signupMutation.isLoading ? <Loader /> : "Sign Up"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to={"/owner/signin"} className="text-[#0A2647] font-semibold hover:text-[#F5C518] transition-all">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OSignUp;
