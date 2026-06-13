import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import CNavbar from "../../components/customer/CNavbar";

function MyBookings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 1, comment: "" });
  const [filterStatus, setFilterStatus] = useState("ALL"); // Filter state

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    const response = await axios.get(`${API_URL}/booking/mybookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  };

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookings,
  });

  /* ================= CANCEL BOOKING ================= */
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId) =>
      axios.put(
        `${API_URL}/booking/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries(["myBookings"]);
    },
    onError: () => toast.error("Failed to cancel booking"),
  });

  /* ================= ADD / EDIT REVIEW ================= */
  const reviewMutation = useMutation({
    mutationFn: async ({ resortId, bookingId, reviewId, rating, comment }) => {
      const USER_ID = JSON.parse(sessionStorage.getItem("profile"));
      if (!USER_ID) throw new Error("User not logged in");

      const payload = {
        userId: USER_ID,
        resortId,
        bookingId,
        rating,
        review: comment,
      };

      if (reviewId) {
        return axios.put(`${API_URL}/review/edit/${reviewId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        return axios.post(`${API_URL}/review/add`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries(["myBookings"]);
      setOpenReviewModal(false);
    },
    onError: () => toast.error("Failed to submit review"),
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center mt-10 text-gray-600">
        Failed to load bookings
      </div>
    );

  // Filter bookings based on status
  const filteredBookings = bookings.filter((b) =>
    filterStatus === "ALL" ? true : b.status === filterStatus
  );

  return (
    <>
      <CNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10 mt-15">

        {/* ================= FILTER BUTTONS ================= */}
        <div className="flex gap-4 mb-6">
          {["ALL", "BOOKED", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No bookings found for selected filter
          </div>
        )}

        <div className="grid gap-6">
          {filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              onClick={() =>
                navigate(`/customer/resort/${b.resort.resortId}`)
              }
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={b.resort.resortImgUrl}
                  alt={b.resort.name}
                  className="w-full md:w-64 h-48 object-cover"
                />

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {b.resort.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {b.resort.location}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        b.status === "BOOKED"
                          ? "bg-green-100 text-green-700"
                          : b.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm text-gray-700">
                    <div>
                      <p className="text-gray-500">Guests</p>
                      <p className="font-medium">{b.numOfPersons}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Days</p>
                      <p className="font-medium">{b.noOfDays}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booked On</p>
                      <p className="font-medium">
                        {new Date(b.bookedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold text-lg text-gray-900">
                        ₹{b.totalAmount}
                      </p>
                    </div>
                  </div>

                  {b.review && (
                    <p className="text-gray-600 text-sm mt-2">
                      Your Review: "{b.review.review}" ⭐ {b.review.rating}/5
                    </p>
                  )}

                  <div className="mt-6 flex gap-4">
                    {b.status === "BOOKED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                          setOpenCancelModal(true);
                        }}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {b.status === "COMPLETED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                          setSelectedReviewId(b.review?.reviewId || null);
                          setReviewData({
                            rating: b.review?.rating || 1,
                            comment: b.review?.review || "",
                          });
                          setOpenReviewModal(true);
                        }}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {b.review ? "Edit Review" : "Give Review"}
                      </button>
                    )}

                    {b.status === "CANCELLED" && (
                      <span className="text-sm text-red-500 self-center">
                        This booking was cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CANCEL MODAL ================= */}
      {openCancelModal && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setOpenCancelModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">Cancel Booking</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setOpenCancelModal(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => {
                  cancelBookingMutation.mutate(selectedBooking.bookingId);
                  setOpenCancelModal(false);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW MODAL ================= */}
      {openReviewModal && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setOpenReviewModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">
              {selectedReviewId ? "Edit Review" : "Give Review"}
            </h2>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 mr-2">Rating:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl cursor-pointer ${
                      reviewData.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setReviewData({ ...reviewData, rating: star })
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              <div>
                <label className="text-sm text-gray-600">Review</label>
                <textarea
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="mt-1 w-full border px-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setOpenReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => {
                  if (!reviewData.comment.trim()) {
                    toast.error("Review cannot be empty");
                    return;
                  }
                  reviewMutation.mutate({
                    resortId: selectedBooking.resort.resortId,
                    bookingId: selectedBooking.bookingId,
                    reviewId: selectedReviewId,
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                  });
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyBookings;
