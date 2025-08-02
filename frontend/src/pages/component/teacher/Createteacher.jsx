


import React, { useState, useEffect } from "react";
import Adminsidebar from "../sidebar/Adminsidebar"; 
import { createTeacherApi } from "../../../api/api"; 

const CreateteacherForm = () => {
  const [formData, setFormData] = useState({
    name: "kishu",
    address: "butwal",
    subject: "maths",
    qualification: "cyber security",
    email: "kchhetri2010@gmail.com",
    password: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (photo) {
        data.append("photo", photo);
      }

      const response = await createTeacherApi(data);
      alert("Teacher added successfully!");
      console.log("Backend response:", response.data);

      // Reset form
      setFormData({
        name: "",
        address: "",
        subject: "",
        qualification: "",
        email: "",
        password: "",
      });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to add teacher.");
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-900 via-purple-900 to-black text-white">
      <Adminsidebar />

      <div className="flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-40 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Add Teacher</h2>

          {/* Full Name */}
          <label className="block mb-4">
            <span className="text-sm">Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Address */}
          <label className="block mb-4">
            <span className="text-sm">Address</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Subject */}
          <label className="block mb-4">
            <span className="text-sm">Subject</span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Qualification */}
          <label className="block mb-4">
            <span className="text-sm">Qualification</span>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Email */}
          <label className="block mb-4">
            <span className="text-sm">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Password */}
          <label className="block mb-4">
            <span className="text-sm">Password (optional)</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank for default"
              className="mt-1 w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
            />
          </label>

          {/* Photo Upload */}
          <label className="block mb-6">
            <span className="text-sm">Photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-1 w-full text-white"
            />
          </label>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="mb-6 flex justify-center">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-2 border-purple-600"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 py-2 rounded-xl font-semibold"
          >
            Save Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateteacherForm;
