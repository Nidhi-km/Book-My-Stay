import { useMutation } from "@tanstack/react-query";
import { addResortSchema } from "../../formikValidation";
import axios from "axios";
import { API_URL, getErrorMessage } from "../../utils";
import { HomeIcon, MapPin, FileText, IndianRupee, Building2 } from "lucide-react";
import { Formik, Form, ErrorMessage } from "formik";
import { UserCog } from "lucide-react";
import Loader from "../../components/common/Loader.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddResort = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const addResort = async (val) => {
        const res = await axios.post(`${API_URL}/resort/add`, val,
            { headers: { Authorization: `Bearer ${token}` } });
        return res.data.resort;
    };

    const addResortMutation = useMutation({
        mutationFn: addResort,
        mutationKey: ["add-resort"],
        onError: (error) => toast.error(getErrorMessage(error)),
        
    });

    return (
        <section className="min-h-screen flex items-center justify-center bg-white p-4 font-outfit relative">

            <button
                onClick={() => navigate(`/owner/home`)}
                className="absolute top-6 left-6 flex items-center gap-2 text-[#0A2647] font-medium hover:text-[#F5C518] transition-all"
            >
                <HomeIcon size={20} />
            </button>

            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-[#F5C518]/40">
                <h1 className="text-[#0A2647] font-bold text-3xl text-center mb-2">
                    Add Resort
                </h1>

                <Formik
                    validationSchema={addResortSchema}
                    initialValues={{
                        name: "",
                        location: "",
                        description: "",
                        amount: "",
                        facilities: "",
                    }}
                    onSubmit={(val, { resetForm }) => {
                        const updatedVal = {
                            ...val,
                            facilities: val.facilities.split(",").map(f => f.trim()),
                        };
                        addResortMutation.mutate(updatedVal, {
                            onSuccess: (data) => {
                                //toast.success("Resort Added Successfully");
                                const resortId = data.resortId;
                                console.log("New Resort ID:", resortId);
                                
                                resetForm();
                                navigate(`/uploadImg/${resortId}`);
                            },
                        });
                    }}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form className="space-y-4">
                            {/* Resort Name */}
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Resort Name"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Location */}
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Resort Address"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.location}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="location" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Description */}
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Description about your Resort"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Amount */}
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="amount"
                                    placeholder="Amount/day"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.amount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="amount" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Facilities */}
                            <div className="relative">
                                <UserCog className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="facilities"
                                    placeholder="Facilities"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                    value={values.facilities}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <ErrorMessage name="facilities" component="p" className="text-red-500 text-xs mt-1" />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={addResortMutation.isLoading}
                                className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#F5C518] hover:text-[#0A2647] focus:ring-2 focus:ring-[#F5C518]/70 transition-all flex justify-center items-center gap-2"
                            >
                                {addResortMutation.isLoading ? <Loader /> : "Add Resort"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default AddResort;
