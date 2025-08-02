import React, { useState, useEffect } from "react";
import StudentSidebar from "../../sidebar/Studentsidebar";
import { sendMessageApi, getStudentMessagesApi } from "../../../../api/api";
import { useAuth } from "../../../../context/AuthContext";

const StudentMessage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  // Fetch student's messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getStudentMessagesApi();
      console.log("Messages response:", response.data);
      const messagesData = response.data?.data || [];
      setMessages(messagesData);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      await sendMessageApi(formData);
      setSuccess("Message sent successfully!");
      
      // Reset form
      setFormData({ subject: "", message: "" });
      
      // Refresh messages
      fetchMessages();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">💬 Message Admin</h1>
            <p className="text-gray-300 text-sm mt-1">
              Send messages to the admin and view your message history.
            </p>
          </header>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-300 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 text-green-300 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Send Message Form */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Send New Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 text-white border border-gray-600 focus:outline-none focus:border-indigo-400"
                    placeholder="Enter message subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-2 rounded-md bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 text-white border border-gray-600 focus:outline-none focus:border-indigo-400"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 text-white py-2 px-4 rounded-md transition font-semibold"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Message History */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Your Messages</h2>
              
              {loading ? (
                <div className="text-center text-gray-300">
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400">
                  <p>No messages yet. Send your first message!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 p-4 rounded-lg border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{msg.subject}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{msg.message}</p>
                      
                      {msg.adminResponse && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-xs text-indigo-300 mb-1">Admin Response:</p>
                          <p className="text-indigo-200 text-sm">{msg.adminResponse}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(msg.respondedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          msg.isRead ? 'bg-indigo-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>
                          {msg.isRead ? 'Read' : 'Unread'}
                        </span>
                        {msg.adminResponse && (
                          <span className="text-xs text-indigo-400">✓ Responded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentMessage; 