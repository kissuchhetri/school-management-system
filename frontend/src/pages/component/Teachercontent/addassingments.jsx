
import React, { useState } from "react";
import TeacherSidebar from "../sidebar/Teachersidebar";
import { AssignmentApi } from "../../../api/api";  

const AddAssignmentPage = () => {
  const [form, setForm] = useState({
    subject: "",
    title: "",
    dueDate: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.subject || !form.title || !form.dueDate || !form.description) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await AssignmentApi(form); // call your API here
      setSuccess("Assignment submitted successfully!");
      setForm({
        subject: "",
        title: "",
        dueDate: "",
        description: "",
      });
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit assignment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="max-w-3xl mx-auto bg-auto bg-opacity-40 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            ➕ Add New Assignment
          </h1>

          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 text-green-600 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm text-black">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Science"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-black">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Lab Report on Cells"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-black">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-90 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-black">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the assignment..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
            >
              Submit Assignment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddAssignmentPage;
