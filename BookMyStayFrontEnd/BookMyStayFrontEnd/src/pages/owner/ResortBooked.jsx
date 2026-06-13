import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, getErrorMessage } from "../../utils.js";
import Loader from "../../components/common/Loader.jsx";
import ONavbar from "../../components/owner/ONavbar.jsx";
import { toast } from "react-hot-toast";
import { Users, CalendarDays, IndianRupee, X, Check } from "lucide-react";

const ResortBooked = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("UPCOMING"); 
  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    const res = await axios.get(`${API_URL}/booking/getBookedInfo`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: fetchBookings,
  });

  const BOOKINGS_LIST = data?.data || [];

  // ================= DATE HELPERS =================
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const today = new Date().setHours(0, 0, 0, 0);

  // ================= FILTER BOOKINGS =================
  const filteredBookings = BOOKINGS_LIST.filter((b) => {
    const checkIn = new Date(b.checkInDate).setHours(0, 0, 0, 0);

    if (filter === "UPCOMING") return b.status === "BOOKED" && checkIn >= today;
    if (filter === "COMPLETED") return b.status === "COMPLETED";
    if (filter === "CANCELLED") return b.status === "CANCELLED";
    return true;
  });

  // ================= DENY BOOKING =================
  const denyBooking = async (bookingId) => {
    const res = await axios.put(
      `${API_URL}/booking/cancel/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  };

  const denyMutation = useMutation({
    mutationFn: denyBooking,
    onSuccess: () => {
      toast.success("Booking denied");
      queryClient.invalidateQueries(["owner-bookings"]);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // ================= COMPLETE BOOKING =================
  const completeBooking = async (bookingId) => {
    const res = await axios.put(
      `${API_URL}/booking/staycompleted/${bookingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  };

  const completeMutation = useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      toast.success("Marked as completed");
      queryClient.invalidateQueries(["owner-bookings"]);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) return <Loader />;

  if (isError)
    return <div className="text-center mt-10">Failed to load bookings</div>;

  // ================= BOOKING CARD =================
  const BookingBar = ({ data }) => {
    const {
      bookingId,
      status,
      checkInDate,
      checkOutDate,
      noOfDays,
      numOfPersons,
      totalAmount,
      user,
      resort,
    } = data;

    return (
      <article className="flex justify-between gap-6 bg-white rounded-xl shadow-md p-5">
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} />
            {user?.name}
          </h2>

          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            <CalendarDays size={16} />
            {formatDate(checkInDate)} → {formatDate(checkOutDate)} ({noOfDays} days)
          </p>

          <p className="text-sm">Persons: {numOfPersons}</p>

          <p className="flex items-center gap-1 text-sm">
            <IndianRupee size={16} /> {totalAmount}
          </p>

          <span
            className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full
              ${
                status === "BOOKED"
                  ? "bg-yellow-100 text-yellow-700"
                  : status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {status}
          </span>

          {/* ACTION BUTTONS */}
          {status === "BOOKED" && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => completeMutation.mutate(bookingId)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg"
              >
                <Check size={16} />
                Complete
              </button>

              <button
                onClick={() => denyMutation.mutate(bookingId)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}
        </div>

        <div className="w-[220px]">
          <img
            src={resort?.resortImgUrl}
            className="w-full h-[140px] object-cover rounded-lg"
          />
        </div>
      </article>
    );
  };

  // ================= RENDER =================
  return (
    <>
      <ONavbar />

      <section className="max-w-[1200px] mx-auto mt-20 p-4">
        {/* FILTER BUTTONS */}
        <div className="flex gap-4 mb-6">
          {["UPCOMING", "COMPLETED", "CANCELLED"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium
                ${
                  filter === type
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500">
            No {filter.toLowerCase()} bookings
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredBookings.map((booking) => (
              <BookingBar key={booking.bookingId} data={booking} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default ResortBooked;
