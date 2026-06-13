import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import { addResortImgSchema } from "../../formikValidation";
import { API_URL } from "../../utils";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { Upload, HomeIcon } from "lucide-react";
import { useState } from "react";
import ONavbar from "../../components/owner/ONavbar.jsx";

function UploadImg() {
  const { resortId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [preview, setPreview] = useState(null);

  const uploadImg = async (formData) => {
    const res = await axios.put(`${API_URL}/resort/upload/${resortId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };

  const addResortImgMutation = useMutation({
    mutationFn: uploadImg,
    mutationKey: ["upload-img"],
  });

  return (
    <>
    <ONavbar/>
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-4 font-outfit relative">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-[#F5C518]/30">
        <h1 className="text-[#0A2647] font-bold text-3xl text-center mb-6">
          Upload Resort Image
        </h1>

        <Formik
          validationSchema={addResortImgSchema}
          initialValues={{
            img: "",
           // name: ,
            isChanged: "true",
          }}
          onSubmit={(values, { resetForm }) => {
            const formData = new FormData();
            formData.append("img", values.img);
            //formData.append("name", values.name);
            formData.append("isChanged", values.isChanged);
            formData.append("resortId", resortId);

            addResortImgMutation.mutate(formData, {
              onSuccess: () => {
                toast.success("Image Uploaded Successfully");
                resetForm();
                setPreview(null);
                navigate("/owner/home");
              },
            });
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-5">
              {/* Resort Name */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resort Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter resort name"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#0A2647] focus:outline-none"
                  onChange={(e) => setFieldValue("name", e.target.value)}
                />
                <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
              </div> */}

              
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Resort Image
  </label>

  {!preview ? (
    /* Upload Box */
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-36 
                         border-2 border-dashed border-gray-300 rounded-lg 
                         cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG (max 2MB)</p>
        </div>

        <input
          type="file"
          name="img"
          className="hidden"
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files[0];
            if (file) {
              setFieldValue("img", file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
      </label>
    </div>
  ) : (
    /* Preview Box */
    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
      <img
        src={preview}
        alt="Preview"
        className="w-full h-40 object-cover rounded-md mb-2"
      />

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 truncate">
          Image selected ✔
        </p>

        <label className="text-sm text-blue-600 cursor-pointer hover:underline">
          Change
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              if (file) {
                setFieldValue("img", file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>
    </div>
  )}

  <ErrorMessage
    name="img"
    component="p"
    className="text-red-500 text-xs mt-1"
  />
</div>


              <button
                type="submit"
                disabled={addResortImgMutation.isLoading}
                className="w-full bg-[#0A2647] text-white font-medium py-2.5 rounded-lg hover:bg-[#F5C518] hover:text-[#0A2647] focus:ring-2 focus:ring-[#F5C518]/70 transition-all flex justify-center items-center gap-2"
              >
                {addResortImgMutation.isLoading ? <Loader /> : "Upload Image"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
    </>
  );
}

export default UploadImg;
