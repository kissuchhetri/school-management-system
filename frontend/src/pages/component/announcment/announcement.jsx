

import React, { useState, useEffect } from "react";
import { addAnnouncementApi, getAllAnnouncementsApi, deleteAnnouncementApi } from "../../../api/api";
import Adminsidebar from "../sidebar/Adminsidebar";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Corrected: Fetch all announcements on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAnnouncementsApi(); // ✅ fixed
        console.log("Fetched announcements:", res.data.data); // Debug: Check structure
        setAnnouncements(res.data.data || []);
      } catch (err) {
        console.error("Error fetching announcements", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Corrected: Add new announcement
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    console.log("Button clicked");

    if (!title.trim() || !message.trim()) {
      setError("Both title and message are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await addAnnouncementApi({ title, message }); // ✅ fixed

      console.log("Announcement added:", res.data);

      setAnnouncements([res.data.data, ...announcements]);
      setTitle("");
      setMessage("");
      setError("");
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError("Failed to add announcement");
    } finally {
      setLoading(false);
    }
  };

  // Delete announcement function
  const handleDeleteAnnouncement = async (id) => {
    console.log("Attempting to delete announcement with ID:", id); // Debug: Check ID
    
    if (!id) {
      console.error("No ID provided for deletion");
      setError("Cannot delete: No ID found");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAnnouncementApi(id);
      
      // Remove the deleted announcement from state
      setAnnouncements(announcements.filter(announcement => {
        // Try different possible ID field names
        const announcementId = announcement._id || announcement.id || announcement.announcementId;
        return announcementId !== id;
      }));
      console.log("Announcement deleted successfully");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Adminsidebar />

      <main className="flex-1 p-8 bg-gradient-to-br from-green-900 via-purple-900 to-black">
        <h1 className="text-3xl font-bold mb-6">📢 Announcements</h1>

        <form onSubmit={handleAddAnnouncement} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white"
              placeholder="Announcement title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full p-3 rounded bg-gray-800 text-white"
              placeholder="Enter announcement message..."
            />
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Posting..." : "Add Announcement"}
          </button>
        </form>

        <div className="space-y-4">
          {announcements.map((a) => {
            // Debug: Log each announcement object to see its structure
            console.log("Announcement object:", a);
            
            // Try different possible ID field names
            const announcementId = a._id || a.id || a.announcementId;
            
            return (
              <div
                key={announcementId}
                className="bg-black bg-opacity-40 p-4 rounded border border-purple-700 relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="font-bold">{a.title}</h2>
                    <p>{a.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Posted on {new Date(a.createdAt).toLocaleString()}
                    </p>
                    {/* Debug: Show the ID being used */}
                    <p className="text-xs text-gray-500 mt-1">ID: {announcementId}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcementId)}
                    disabled={deletingId === announcementId}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === announcementId ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Announcement;
