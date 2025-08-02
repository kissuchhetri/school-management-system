import React, { useEffect, useState } from "react";
import StudentSidebar from "../../sidebar/Studentsidebar";
import { FaBullhorn, FaCalendarAlt } from "react-icons/fa";
import { getAllAnnouncementsApi } from "../../../../api/api";

const StudentAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const response = await getAllAnnouncementsApi(); 
      console.log("Student Announcements API Response:", response.data); 
      
      setAnnouncements(response.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex text-white">
      <StudentSidebar />
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-indigo-300 mb-10">
            📢 Announcements
          </h1>

          {loading ? (
            <p className="text-center text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : announcements.length === 0 ? (
            <p className="text-center text-gray-400">No announcements available.</p>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => {
                // Debug: Log each announcement to see its structure
                console.log("Student Announcement object:", announcement);
                
                // Try different possible ID field names
                const announcementId = announcement._id || announcement.id || announcement.announcementId;
                
                return (
                  <div
                    key={announcementId}
                    className="bg-black bg-opacity-40 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FaBullhorn className="text-yellow-400" />
                        {announcement.title}
                      </h2>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <FaCalendarAlt />
                        {new Date(announcement.createdAt || announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{announcement.message}</p>
                    {/* Debug: Show the ID being used */}
                    <p className="text-xs text-gray-500 mt-2">ID: {announcementId}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAnnouncement;
