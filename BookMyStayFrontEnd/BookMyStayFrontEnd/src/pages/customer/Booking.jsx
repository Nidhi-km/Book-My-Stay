import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import CNavbar from "../../components/customer/CNavbar.jsx";
import { Form, Formik, ErrorMessage } from "formik";
import { bookingSchema } from "../../formikValidation.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, getErrorMessage } from "../../utils.js";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader.jsx";

const Booking = () => {
  const navigate = useNavigate();
  const { resortId } = useParams();
  const resortIdNum = Number(resortId);

  const USER_ID = JSON.parse(sessionStorage.getItem("profile"));
  const token = localStorage.getItem("token");

  /* ---------- Booking API ---------- */
  const booking = async (val) => {
    console.log("FORM VALUES:", val);

    const res = await axios.post(`${API_URL}/booking/bookResort`, val, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const bookingMutation = useMutation({
    mutationFn: booking,
    onSuccess: () => {
      toast.success("Resort Booked Successfully");
      setTimeout(() => navigate("/customer/resorts"), 300);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  /* ---------- Get Resort Details ---------- */
  const fetchResort = async () => {
    const res = await axios.get(`${API_URL}/resort/getResort/${resortId}`);
    return res.data.data;
  };

  const {
    data: resortdata,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resort-details", resortId],
    queryFn: fetchResort,
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <div className="text-center mt-10">Failed to load resort</div>;

  const { name, amount, location, resortImgUrl } = resortdata;

  return (
    <>
      <CNavbar />

      <div className="flex justify-center py-12 bg-gray-100 px-4 mt-10">
        <div className="max-w-3xl w-full space-y-8">
          {/* ---------- Resort Card ---------- */}
          <div className="bg-white shadow-lg rounded-xl p-5 border flex gap-4">
            <img
              src={resortImgUrl}
              alt="resort"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-semibold">{name}</h1>
              <p className="text-gray-600">{location}</p>
              <p className="text-green-600 font-bold">₹{amount} / day</p>
            </div>
          </div>

          {/* ---------- Booking Form ---------- */}
          <div className="bg-white border shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Book Your Stay</h2>

            <Formik
              validationSchema={bookingSchema}
              initialValues={{
                userId: USER_ID,
                resortId: resortIdNum,
                numOfPersons: 0,
                numOfDays: 1,
                checkInDate: "",
                checkOutDate: "",
                paymentMode: "PAY_AT_RESORT",
                guestName: "",
                email: "",
                phone: "",
              }}
              onSubmit={(values) => {
                const val = {
                  userId: USER_ID,
                  resortId: resortIdNum,
                  numOfPersons: Number(values.numOfPersons),
                  noOfDays: Number(values.numOfDays),
                  checkInDate: values.checkInDate,
                  guestName: values.guestName,
                  email: values.email,
                  phone: values.phone,
                  paymentMode: values.paymentMode, // exact enum string
                };
                bookingMutation.mutate(val);
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue }) => {
                /*  AUTO SET CHECKOUT DATE */
                const updateCheckout = (checkIn, days) => {
                  if (!checkIn || !days) return;
                  const date = new Date(checkIn);
                  date.setDate(date.getDate() + Number(days));
                  setFieldValue(
                    "checkOutDate",
                    date.toISOString().split("T")[0]
                  );
                };

                const totalAmount =
                  amount * values.numOfPersons * values.numOfDays;

                return (
                  <Form className="space-y-5">
                    {/* Guest Name */}
                    <div>
                      <label>Guest Name:</label>
                      <input
                        type="text"
                        name="guestName"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.guestName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="guestName"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label>Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Persons */}
                    <div>
                      <label>Enter Number Of persons:</label>
                      <input
                        type="number"
                        name="numOfPersons"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.numOfPersons}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="numOfPersons"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* Check-in */}
                    <label>Check-in Date:</label>
                    <div>
                      <input
                        type="date"
                        name="checkInDate"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.checkInDate}
                        onChange={(e) => {
                          handleChange(e);
                          updateCheckout(e.target.value, values.numOfDays);
                        }}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="checkInDate"
                        component="p"
                        className="text-red-500 text-xs"
                      />
                    </div>

                    {/* 🔹 Number of Days*/}
                    <div>
                      <label>Number of days:</label>
                      <input
                        type="number"
                        name="numOfDays"
                        min="1"
                        className="w-full border rounded-md px-3 py-2"
                        value={values.numOfDays}
                        onChange={(e) => {
                          handleChange(e);
                          updateCheckout(values.checkInDate, e.target.value);
                        }}
                      />
                    </div>

                    {/* Check-out (Auto Calculated) */}
                    <div>
                      <input
                        type="date"
                        name="checkOutDate"
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                        value={values.checkOutDate}
                        readOnly
                      />
                      {values.checkOutDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          Checkout time is <b>10:00 AM</b>
                        </p>
                      )}
                    </div>

                    {/* Payment Mode */}
                    <select
                      name="paymentMode"
                      value={values.paymentMode}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="PAY_AT_RESORT">Pay at Resort</option>
                      <option value="ONLINE">Online</option>
                    </select>

                    {/* Total Amount */}
                    {values.numOfDays > 0 && values.numOfPersons > 0 && (
                      <div className="bg-gray-100 p-4 rounded-md">
                        <p>
                          <b>Days:</b> {values.numOfDays}
                        </p>
                        <p>
                          <b>Price per day:</b> ₹{amount}
                        </p>
                        <p className="text-lg font-semibold text-green-700">
                          Total Amount: ₹{totalAmount}
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={bookingMutation.isLoading}
                      className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800"
                    >
                      {bookingMutation.isLoading ? "Booking..." : "Book Now"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
