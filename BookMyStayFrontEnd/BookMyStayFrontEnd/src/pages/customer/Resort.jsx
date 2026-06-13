import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import CNavbar from "../../components/customer/CNavbar.jsx";
import Footer from "../../components/common/Footer.jsx";
import axios from "axios";
import { API_URL } from "../../utils.js";
import Loader from "../../components/common/Loader.jsx";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FiShare2 } from "react-icons/fi";

const Resort = () => {
  const navigate = useNavigate();
  const { resortId } = useParams();
  const USER_ID = JSON.parse(sessionStorage.getItem("profile"));
  console.log("USER_ID:", USER_ID);
  const [visibleReviews, setVisibleReviews] = React.useState(2);

  const handleBooking = () => {
    navigate(`/customer/resort/booking/${resortId}`);
  };

  const fetchResort = async () => {
    const response = await axios.get(`${API_URL}/resort/getResort/${resortId}`);
    return response.data.data;
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
    return (
      <div className="text-center mt-10 text-gray-600">
        Failed to load resorts
      </div>
    );

  if (!resortdata) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-4">Resort data not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-yellow-500 text-white rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    name,
    description,
    amount,
    location: place,
    facilities,
    resortImgUrl,
    user,
    review,
  } = resortdata;

  const averageRating =
    review && review.length > 0
      ? (review.reduce((sum, r) => sum + r.rating, 0) / review.length).toFixed(
          1
        )
      : 0;

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));

  return (
    <>
      <CNavbar />

      <section className="min-h-screen bg-white mt-20 border-t border-gray-200">
        {resortImgUrl && (
          <div className="relative w-full h-[420px] overflow-hidden">
            <img
              src={resortImgUrl}
              alt={name}
              className="w-full h-full object-cover"
            />

            {/* Overlay for title and location */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-8">
              <h1 className="text-4xl font-bold text-white">{name}</h1>
              {place && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${name} ${place}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 flex items-center gap-2 mt-2 hover:underline cursor-pointer"
                >
                  <MapPin size={18} />
                  {place}
                </a>
              )}
            </div>

            {/* Contact button */}
            {user && (
              <div className="absolute top-6 right-16 group">
                <button className="bg-yellow-400 text-[#0A2647] font-medium px-3 py-1.5 rounded-md shadow hover:bg-yellow-500 transition-all">
                  Contact
                </button>
                <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow p-3 w-52 absolute right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    {user.role === "RESORT_OWNER" ? "Resort Owner" : user.role}
                  </p>
                  <p className="text-xs text-gray-700">📧 {user.email}</p>
                  <p className="text-xs text-gray-700">📞 {user.phoneNumber}</p>
                </div>
              </div>
            )}

            {/* Share button on image */}
            <div className="absolute top-6 right-6">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: name,
                        text: `Check out this resort: ${name}`,
                        url: window.location.href,
                      })
                      .catch((err) => console.log(err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Resort link copied!");
                  }
                }}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg flex items-center justify-center transition-all"
                title="Share Resort"
              >
                <FiShare2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto py-12 px-6">
          <div className="flex justify-between items-center border-b pb-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              Resort Overview
            </h2>
            {amount && (
              <p className="text-lg font-semibold text-yellow-700">
                ₹{amount} / day
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-8">{description}</p>

          {facilities?.length > 0 && (
            <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-3">
                {facilities.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-white border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {review?.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold">Guest Reviews</h3>
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-sm font-semibold">{averageRating}</span>
                  <span className="text-xs text-gray-500">
                    ({review.length})
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {review.slice(0, visibleReviews).map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={r.user?.profileImgUrl || "/default-user.png"}
                          alt="user"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {r.user?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex">{renderStars(r.rating)}</div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm font-medium">
                      {r.review}
                    </p>
                  </div>
                ))}
              </div>

              {review.length > 2 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() =>
                      setVisibleReviews((prev) =>
                        prev === 2 ? review.length : 2
                      )
                    }
                    className="px-4 py-1 text-yellow-600 font-medium text-sm rounded hover:bg-yellow-50 transition"
                  >
                    {visibleReviews === 2 ? "Load more reviews" : "Read less"}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (!USER_ID) {
                toast.error("Login to book the resort!");
                navigate("/customer/signin");
                return;
              }
              handleBooking();
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-2 rounded-full"
          >
            Book Now
          </button>
        </div>

        <Footer />
      </section>
    </>
  );
};

export default Resort;
