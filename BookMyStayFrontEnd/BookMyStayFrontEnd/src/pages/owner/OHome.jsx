import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, getErrorMessage } from "../../utils.js";
import {
  Building2,
  CalendarDays,
  DollarSign,
  PlusCircle
} from "lucide-react";
import axios from "axios";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

import ONavbar from "../../components/owner/ONavbar.jsx";
import Footer from "../../components/common/Footer.jsx";

const COLORS = ["#4caf50", "#f44336", "#2196f3"];

const OHome = () => {
  const token = localStorage.getItem("token");
  const id = sessionStorage.getItem("profile");

  const [bookings, setBookings] = useState([]);

  const [totalResorts, setTotalResorts] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [stats, setStats] = useState({
    booked: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0
  });

  // 🔹 Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (token) fetchDashboardData();
  }, []);

  // 🔹 Fetch bookings
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/booking/getBookedInfo`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = res.data?.data || res.data || [];

      setBookings(data);
      setTotalBookings(data.length);

      setTotalRevenue(
        data
          .filter(
            b => b.status === "BOOKED" || b.status === "COMPLETED"
          )
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      );

      setQuickRange(7, data);
    } catch (err) {
      console.error("API ERROR ❌", err.response || err.message);
    }
  };

  // 🔹 Fetch reviews
  useEffect(() => {
    if (!token || !id) return;

    axios
      .get(`${API_URL}/review/owner/getreviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log("Reviews fetched ✅", res.data);
        setReviews(res.data?.data || []);
      })
      .catch(err => {
        console.error("Review fetch error ❌", err);
      })
      .finally(() => setLoadingReviews(false));
  }, [token, id]);

  useEffect(() => {
    axios
      .get(`${API_URL}/resort/adminResorts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTotalResorts(res.data.data); // set resorts array
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const calculateStats = (data, from, to) => {
    const filtered = data.filter(b => {
      const d = new Date(b.bookedAt);
      return d >= from && d <= to;
    });

    setStats({
      booked: filtered.filter(b => b.status === "BOOKED").length,
      cancelled: filtered.filter(b => b.status === "CANCELLED").length,
      completed: filtered.filter(b => b.status === "COMPLETED").length,
      revenue: filtered
        .filter(b => b.status !== "CANCELLED")
        .reduce((s, b) => s + (b.totalAmount || 0), 0)
    });
  };

  const setQuickRange = (days, data = bookings) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(to.toISOString().split("T")[0]);

    calculateStats(data, from, to);
  };

  const applyFilter = () => {
    calculateStats(
      bookings,
      new Date(fromDate),
      new Date(toDate)
    );
  };

  const chartData = [
    { name: "Booked", value: stats.booked },
    { name: "Cancelled", value: stats.cancelled },
    { name: "Completed", value: stats.completed }
  ];

  const actions = [
    {
      title: "Total Resorts",
      value: totalResorts.length,
      icon: <Building2 size={32} />,
      link: token ? `/owner/resorts/${id}` : "/owner/signin",
      description: "View all your resorts"
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: <CalendarDays size={32} />,
      link: token ? "/owner/bookings" : "/owner/signin",
      description: "Track upcoming bookings"
    },
    {
      title: "Revenue (₹)",
      value: totalRevenue,
      icon: <DollarSign size={32} />,
      description: "Check your earnings"
    }
  ];

  return (
    <>
      <ONavbar />

      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-20 pb-12 font-outfit">
        <div className="max-w-7xl mx-auto px-6">

          {/* Add Resort */}
          <div className="flex justify-end mb-6">
            <Link
              to={token ? "/owner/addresort" : "/owner/signin"}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all"
            >
              <PlusCircle size={20} />
              Add Resort
            </Link>
          </div>

          {/* Action Cards */}
          <div className="flex flex-nowrap gap-6 overflow-x-auto pb-3 scrollbar-hide">
            {actions.map((action, idx) => (
              <Link
                key={idx}
                to={action.link}
                className="flex-1 min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-center"
              >
                <div className="mx-auto text-[#0A2647] mb-3">
                  {action.icon}
                </div>
                <h2 className="text-lg font-semibold mb-1">
                  {action.title}
                </h2>
                <p className="text-gray-600 text-sm mb-1">
                  {action.description}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {action.value}
                </p>
              </Link>
            ))}
          </div>

          {/* SALES ANALYTICS */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-10">
            <h2 className="text-xl font-semibold mb-4">
              Sales & Booking Analytics
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => setQuickRange(0)} className="px-4 py-2 bg-gray-200 rounded">Today</button>
              <button onClick={() => setQuickRange(7)} className="px-4 py-2 bg-gray-200 rounded">Last 7 Days</button>
              <button onClick={() => setQuickRange(30)} className="px-4 py-2 bg-gray-200 rounded">1 Month</button>
              <button onClick={() => setQuickRange(180)} className="px-4 py-2 bg-gray-200 rounded">6 Months</button>
              <button onClick={() => setQuickRange(365)} className="px-4 py-2 bg-gray-200 rounded">1 Year</button>

              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded px-3 py-2" />
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded px-3 py-2" />
              <button onClick={applyFilter} className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-100 p-4 rounded text-center">Booked<br /><b>{stats.booked}</b></div>
              <div className="bg-gray-100 p-4 rounded text-center">Cancelled<br /><b>{stats.cancelled}</b></div>
              <div className="bg-gray-100 p-4 rounded text-center">Completed<br /><b>{stats.completed}</b></div>
              <div className="bg-gray-100 p-4 rounded text-center">Revenue<br /><b>₹{stats.revenue}</b></div>
            </div>

            {/* Charts */}
            <div className="flex flex-col md:flex-row gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" outerRadius={100}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔹 REVIEWS SECTION */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-10">
            <h2 className="text-xl font-semibold mb-6">
              Guest Reviews
            </h2>

            {loadingReviews ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews available.</p>
            ) : (
              <div className="relative overflow-hidden">
                <div className="flex gap-6 animate-review-scroll">
                  {[...reviews, ...reviews].map((rev, index) => (
                    <div
                      key={index}
                      className="min-w-[360px] bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-5"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={
                            rev.user?.profileImage ||
                            "https://ui-avatars.com/api/?name=User&background=0A2647&color=fff"
                          }
                          className="w-12 h-12 rounded-full"
                          alt="user"
                        />
                        <div>
                          <h3 className="font-semibold">{rev.user?.name}</h3>
                          <p className="text-yellow-500 text-sm">⭐ {rev.rating}/5</p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        “{rev.review}”
                      </p>

                      <p className="text-xs text-gray-500">
                        Resort:
                        <span className="font-medium ml-1">
                          {rev.resort?.name}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />

      <style>
        {`
          @keyframes reviewScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-review-scroll {
            animation: reviewScroll 15s linear infinite;
          }

          .animate-review-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </>
  );
};

export default OHome;