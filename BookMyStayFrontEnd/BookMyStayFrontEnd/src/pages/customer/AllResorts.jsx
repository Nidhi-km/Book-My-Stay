import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, Loader2 } from "lucide-react";
import Loader from "../../components/common/Loader.jsx";
import CNavbar from "../../components/customer/CNavbar.jsx";
import { API_URL } from "../../utils.js";
import { useSearchParams } from "react-router-dom";
const PAGE_LIMIT = 6;

const fetchResorts = async ({ pageParam = 0, queryKey }) => {
  const [, searchLocation] = queryKey;
  const response = await axios.get(`${API_URL}/resort/allResort`, {
    params: { page: pageParam, limit: PAGE_LIMIT, location: searchLocation || "" },
  });
  return { ...response.data, prevParam: pageParam };
};

const AllResorts = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const initialLocation = searchParams.get("location") || "";
const [searchLocation, setSearchLocation] = useState(initialLocation); // input box
const [locationQuery, setLocationQuery] = useState(initialLocation); // used in queryKey
  const [sortOrder, setSortOrder] = useState(""); 

  const {
    data: resortsData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["resorts", locationQuery],
    queryFn: fetchResorts,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      const totalPages = lastPage.data.totalPages;
      if (totalPages === 0 || prevPage >= totalPages - 1) return undefined;
      return prevPage + 1;
    },
    keepPreviousData: true,
  });

  const RESORTS_LIST = resortsData?.pages?.reduce(
    (result, page) => [...result, ...page?.data?.content],
    []
  );

  // sorting
  const sortedResorts = useMemo(() => {
    if (!RESORTS_LIST) return [];
    if (sortOrder === "asc") return [...RESORTS_LIST].sort((a, b) => a.amount - b.amount);
    if (sortOrder === "desc") return [...RESORTS_LIST].sort((a, b) => b.amount - a.amount);
    return RESORTS_LIST;
  }, [RESORTS_LIST, sortOrder]);

  const handleSearch = () => {
    setLocationQuery(searchLocation); // triggers react-query refetch
  };

  if (isLoading) return <Loader />;
  if (isError)
    return <div className="text-center mt-10 text-gray-600">Failed to load resorts</div>;

  const ResortCard = ({ data }) => {
    const { resortId, name, description, amount, facilities, location, resortImgUrl } = data;
    return (
      <article
        onClick={() => navigate(`/customer/resort/${resortId}`)}
        className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group"
      >
        <div className="relative">
          <img
            src={resortImgUrl || "https://img.freepik.com/free-photo/beautiful-resort-with-swimming-pool_1150-11184.jpg"}
            alt={name}
            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-[4px] rounded-full shadow-md">
            ₹{amount}/day
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 truncate">{name}</h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={14} /> {location}
          </p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {facilities?.slice(0, 3).map((f, i) => (
              <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded-full text-xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <CNavbar />
      <section className="w-full min-h-screen p-4 font-outfit max-w-[1200px] mx-auto mt-20">
        {/* Heading + Search + Sort */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">Explore All Resorts</h1>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Enter location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSearch}
              className="bg-[#F5C518] hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Search
            </button>

            <label className="text-gray-700 font-medium">Sort by Price:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            >
              <option value="">Select</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Resorts List */}
        {sortedResorts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <img
              src="https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-488.jpg"
              alt="No resorts"
              className="w-[200px] h-[200px] mb-3"
            />
            <span className="text-gray-500 text-sm">
              🏝️ No resorts available. Please check again later!
            </span>
          </div>
        )}

        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResorts.map((resort, idx) => (
            <ResortCard data={resort} key={idx} />
          ))}
        </article>

        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-5">
            <Loader2 className="text-[#F5C518] animate-spin" size={24} />
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center items-center py-5">
            <button
              onClick={fetchNextPage}
              className="bg-[#F5C518] hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-full transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default AllResorts;
