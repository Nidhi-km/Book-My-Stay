import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader.jsx";
import CNavbar from "../../components/customer/CNavbar";
import ONavbar from "../../components/owner/ONavbar.jsx";
import { API_URL } from "../../utils";
import { userUpdateSchema } from "../../formikValidation";

const UserProfile = () => {
  const USER_ID = JSON.parse(sessionStorage.getItem("profile"));
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  if (!USER_ID) {
    return (
      <p className="text-center text-gray-500">
        No user profile found. Please log in.
      </p>
    );
  }

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async () => {
    const res = await axios.get(`${API_URL}/auth/user/profile/${USER_ID}`);
    return res.data.data;
  };

  const {
    data: USER_PROFILE_RESPONSE,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-profile-info", USER_ID],
    queryFn: fetchProfile,
    enabled: !!USER_ID,
  });

  useEffect(() => {
    if (USER_PROFILE_RESPONSE) {
      setName(USER_PROFILE_RESPONSE.name || "");
      setPhone(USER_PROFILE_RESPONSE.phoneNumber || "");
    }
  }, [USER_PROFILE_RESPONSE]);

  // ---------------- IMAGE VALIDATION ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    setImage(file);
  };

  // ---------------- UPDATE PROFILE ----------------


 const updateProfile = async (formData) => {
    const res = await axios.put(`${API_URL}/auth/user/update`, formData, {
      headers: {    
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  };

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    mutationKey:["user-profile-update", USER_ID],
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["user-profile-info", USER_ID]);
      setIsEditing(false);
      setImage(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-center text-red-500">Failed to load profile.</p>
    );

  // ---------------- AVATAR ----------------
  const avatar =
    USER_PROFILE_RESPONSE?.profileImgUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      USER_PROFILE_RESPONSE?.name || "User"
    )}&background=random`;

  return (
    <>
      {USER_PROFILE_RESPONSE?.role === "RESORT_OWNER" ? (
        <ONavbar />
      ) : (
        <CNavbar />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 mt-12">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#0A2647]">
            My Profile
          </h2>

          <div className="flex flex-col items-center">
            {/* PROFILE IMAGE */}
            <div className="relative mb-4">
              <img
                src={image ? URL.createObjectURL(image) : avatar}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
              />

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer text-white text-sm">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* FORM */}
            <Formik
              enableReinitialize
              initialValues={{
                name: name,
                phoneNumber: phone,
              }}
              validationSchema={userUpdateSchema}
              onSubmit={(values) => {
                const formData = new FormData();
                formData.append("userId", USER_ID);
                formData.append("name", values.name);
                formData.append("phoneNumber", values.phoneNumber);
                formData.append("isChanged", image ? "true" : "false");

                if (image) {
                  formData.append("img", image);
                }

                updateMutation.mutate(formData);
              }}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="w-full space-y-3">
                  {/* NAME */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      readOnly={!isEditing}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded p-2 ${
                        isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                    />
                    {isEditing && (
                      <p className="text-red-500 text-sm">
                        <ErrorMessage name="name" />
                      </p>
                    )}
                  </div>

                  {/* PHONE */}
                  <div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      readOnly={!isEditing}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded p-2 ${
                        isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                    />
                    {isEditing && (
                      <p className="text-red-500 text-sm">
                        <ErrorMessage name="phoneNumber" />
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <input
                    type="text"
                    value={USER_PROFILE_RESPONSE.email}
                    readOnly
                    className="w-full border rounded p-2 bg-gray-100"
                  />

                 

                  {/* CREATED AT */}
                  <label className="block text-gray-700 font-medium">Created At</label>
                  <input
                    type="text"
                    value={new Date(
                      USER_PROFILE_RESPONSE.createdAt
                    ).toLocaleString()}
                    readOnly
                    className="w-full border rounded p-2 bg-gray-100"
                  />

                  {/* BUTTONS */}
                  {isEditing ? (
                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white p-2 rounded"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setImage(null);
                          setName(USER_PROFILE_RESPONSE.name);
                          setPhone(USER_PROFILE_RESPONSE.phoneNumber);
                        }}
                        className="flex-1 bg-gray-400 text-white p-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="mt-4 w-full bg-green-600 text-white p-2 rounded"
                    >
                      Edit Profile
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
