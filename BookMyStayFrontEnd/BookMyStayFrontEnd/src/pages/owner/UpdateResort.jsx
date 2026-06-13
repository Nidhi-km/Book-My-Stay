import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "../../utils.js";
import Loader from "../../components/common/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../../utils.js";
import { useQueryClient } from "@tanstack/react-query";
import { updateResortSchema } from "../../formikValidation.js";
import { HomeIcon, MapPin, FileText, IndianRupee, Building2, UserCog } from "lucide-react";
import { Formik, Form, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import ONavbar from "../../components/owner/ONavbar.jsx";


const UpdateResort = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { resortId } = useParams();
    const USER_ID = JSON.parse(sessionStorage.getItem("profile"));
    const fetchResort = async () => {
        const response = await axios.get(`${API_URL}/resort/getResort/${resortId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    }

    const { data: resortdata, isLoading, isError } = useQuery({
        queryKey: ["resort-details", resortId],
        queryFn: fetchResort,
    });



    const updateResort = async ({ resortId, updatedData }) => {
        const res = await axios.put(`${API_URL}/resort/updateResort/${resortId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        return res.data;
    }
    const updateMutation = useMutation({
        mutationFn: updateResort,
        mutationKey: ["update-resort"],
        onSuccess: () => {
            toast.success("Resort updated successfully");
            queryClient.invalidateQueries(["resort-details", resortId]);
            navigate(`/owner/resorts/${USER_ID}`);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    })
    if (isLoading) return (<Loader />);
    if (isError) return (<div className="text-center mt-10 text-gray-600">Failed to load resorts</div>);
    if (!resortdata) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 bg-gradient-to-br from-blue-50 to-yellow-50">
                <h1 className="text-2xl font-semibold mb-4"> Resort data not found</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    };

    return (
        <>
            <ONavbar />
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E6F0FF] to-[#FFF6E5] p-6 mt-10">
                <div className="relative bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-gray-100">
                    <h1 className="text-2xl font-bold text-center text-[#0A2647] mb-8">
                        Update Resort
                    </h1>

                    <Formik
                        validationSchema={updateResortSchema}
                        enableReinitialize
                        initialValues={{
                            name: resortdata?.name,
                            location: resortdata?.location,
                            description: resortdata?.description,
                            amount: resortdata?.amount,
                            facilities: resortdata?.facilities,
                        }}
                        onSubmit={(val) => {
                            const updatedVal = {
                                ...val,
                                facilities: val.facilities.split(",").map((f) => f.trim()),
                            };
                            updateMutation.mutate({ resortId, updatedData: updatedVal });
                        }}
                    >
                        {({ values, handleChange, handleBlur }) => (
                            <Form className="space-y-5">
                                {/* Resort Name */}
                                <div className="relative">
                                    <Building2
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        readOnly
                                        className="w-full pl-10 border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Location */}
                                <div className="relative">
                                    <MapPin
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                        value={values.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                        name="location"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Description */}
                                <div className="relative">
                                    <FileText
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <textarea
                                        name="description"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none resize-none"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Amount */}
                                <div className="relative">
                                    <IndianRupee
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="number"
                                        name="amount"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                        value={values.amount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                        name="amount"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Facilities */}
                                <div className="relative">
                                    <UserCog
                                        className="absolute left-3 top-3 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        name="facilities"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                                        value={values.facilities}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage
                                        name="facilities"
                                        component="p"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={updateMutation.isLoading}
                                    className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#F5C518] hover:text-[#0A2647] focus:ring-2 focus:ring-[#F5C518]/70 transition-all flex justify-center items-center gap-2"
                                >
                                    {updateMutation.isLoading ? <Loader /> : "Update Resort"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>

    )
}
export default UpdateResort