
import React, { useState } from "react";
import Adminsidebar from "../sidebar/Adminsidebar";
import { createstudents } from "../../../api/api";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "krishna",
    lastName: "chhetri",
    address: "Butwal, Nepal",
    class: "10",
    fatherName: "Amrit Chhetri",
    motherName: "yamuna Chhetri",
    fatherContact: "1234567890",
    motherContact: "0987654321",
    gmail: "kchhetri2005@gmail.com",
    password: "", // Optional now
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skip validation for password
    for (let field in formData) {
      if (field !== "password" && !formData[field]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, " $1")}`);
        return;
      }
    }

    try {
      const response = await createstudents(formData);
      console.log("Backend response:", response.data);
      alert("Student added successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        class: "",
        fatherName: "",
        motherName: "",
        fatherContact: "",
        motherContact: "",
        gmail: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Adminsidebar />

      <main className="flex-1 bg-gradient-to-br from-green-900 via-purple-900 to-black p-8">
        <div className="max-w-3xl mx-auto bg-black bg-opacity-50 p-10 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Add New Student
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-semibold mb-1">
                First Name
              </label>
              <input
                name="firstName"
                placeholder="Kishu"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Chhetri"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Class</label>
              <input
                name="class"
                type="text"
                placeholder="e.g., 9, 10"
                value={formData.class}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Father's Name
              </label>
              <input
                name="fatherName"
                type="text"
                placeholder="John Doe"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Mother's Name
              </label>
              <input
                name="motherName"
                placeholder="Carolina Doe"
                type="text"
                value={formData.motherName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Father's Contact
              </label>
              <input
                name="fatherContact"
                type="tel"
                pattern="[0-9]{10}"
                placeholder="e.g. 9841000000"
                value={formData.fatherContact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Mother's Contact
              </label>
              <input
                name="motherContact"
                type="tel"
                pattern="[0-9]{10}"
                placeholder="e.g. 9842000000"
                value={formData.motherContact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            {/* Gmail */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Gmail</label>
              <input
                name="gmail"
                type="email"
                placeholder="example@gmail.com"
                value={formData.gmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            {/* Password (optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Password <span className="text-sm text-gray-300">(Optional — leave blank for default)</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to use default"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md text-white bg-transparent border border-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-bold hover:bg-purple-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StudentForm;
