import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/common/Loader.jsx";
import axios from "axios";
import { API_URL, getErrorMessage } from "../../utils.js";
import ONavbar from "../../components/owner/ONavbar.jsx";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { MapPin, Edit, Trash, Camera } from "lucide-react";

const OwnerResorts = () => {


  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedResortId, setSelectedResortId] = useState(null);
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch all resorts by using admin id
  const fetchResorts = async () => {
    const response = await axios.get(`${API_URL}/resort/adminResorts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  };

  const { data: resortsData, isLoading, isError } = useQuery({
    queryKey: ["ownerResorts", id],
    queryFn: fetchResorts,
  });



  // Mutation to delete resort

  const deleteResort = async (resortId) => {
    const res = await axios.delete(`${API_URL}/resort/delete/${resortId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return res.data;
  }
  const deleteMutation = useMutation({
    mutationFn: deleteResort,
    mutationKey: "delete-resort",
    onSuccess: () => {
      toast.success("Resort deleted successfully");
      queryClient.invalidateQueries(["ownerResorts", id]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center mt-10 text-gray-600">
        Failed to load resorts
      </div>
    );

  const RESORTS_LIST = resortsData?.data || [];


  const handleUpdate = (resortId) => {
    navigate(`/resort/update/${resortId}`);
  };
  const handleDelete = (resortId) => {
    deleteMutation.mutate(resortId);
  };
  const handleUpload = (resortId) => {
    navigate(`/uploadImg/${resortId}`)
  }


  //  Resort card
  const ResortCard = ({ data }) => {
    const { resortId, name, description, amount, facilities, location, resortImgUrl } = data;

    return (
      <article className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="relative">
          <img
            src={
              resortImgUrl ||
              "https://img.freepik.com/free-photo/beautiful-resort-with-swimming-pool_1150-11184.jpg"
            }
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
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
              <span
                key={i}
                className="bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded-full text-xs"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
  
  {/* Change Image */}
  <button
    onClick={() => handleUpload(resortId)}
    className="flex items-center gap-2 px-3 py-2 text-sm 
               bg-gray-100 text-gray-700 
               border border-gray-300 
               rounded-lg 
               hover:bg-gray-200 
               transition-all"
  >
    <Camera size={16} />
    Image
  </button>

  {/* Update */}
  <button
    onClick={() => handleUpdate(resortId)}
    className="flex items-center gap-2 px-4 py-2 text-sm 
               bg-blue-600 text-white 
               rounded-lg 
               hover:bg-blue-700 
               transition-all shadow-sm"
  >
    <Edit size={16} />
    Update
  </button>

  {/* Delete */}
  <button
    onClick={() => {
      setSelectedResortId(resortId);
      setOpenDeleteModal(true);
    }}
    disabled={deleteMutation.isLoading}
    className="flex items-center gap-2 px-3 py-2 text-sm 
               bg-red-600 text-white 
               rounded-lg 
               hover:bg-red-700 
               transition-all shadow-sm 
               disabled:opacity-60"
  >
    {deleteMutation.isLoading ? (
      <Loader size={16} />
    ) : (
      <>
        <Trash size={16} />
        Delete
      </>
    )}
  </button>

</div>

        </div>
      </article>
    );
  };

  return (
    <>
      <ONavbar />
      <section className="w-full min-h-screen p-4 font-outfit max-w-[1200px] mx-auto mt-20">
        {RESORTS_LIST.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <img
              src="https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-488.jpg"
              alt="No resorts"
              className="w-[200px] h-[200px] mb-3"
            />
            <span className="text-gray-500 text-sm">
              No resorts available. Please check again later!
            </span>
          </div>
        ) : (
          <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESORTS_LIST.map((resort) => (
              <ResortCard data={resort} key={resort.resortId} />
            ))}
          </article>
        )}
      </section>



      {/* delete popup */}
      {openDeleteModal && (
        <section
          className="w-full fixed top-0 left-0 h-screen bg-black/30 z-[99999] flex justify-center items-center font-outfit"
          onClick={() => setOpenDeleteModal(false)}
        >
          <article
            className="p-5 w-full max-w-[450px] rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[0.9rem] font-normal">
              Are you sure want to delete this Resort ?
            </h1>

            <div className="flex justify-end text-[0.8rem] items-center gap-3 mt-[40px]">
              <button
                className="border border-orange-600 p-1 text-orange-600 rounded-md cursor-pointer"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="border border-orange-600 cursor-pointer p-1 flex justify-center items-center gap-1 bg-orange-600 text-white rounded-md"
                onClick={() => { setOpenDeleteModal(false); handleDelete(selectedResortId); }}

              >
                Delete
                {deleteMutation?.isLoading && <Loader />}
              </button>
            </div>
          </article>
        </section>
      )}
    </>
  );
};

export default OwnerResorts;
