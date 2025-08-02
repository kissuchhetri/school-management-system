import React, { useState, useEffect } from "react";
import Adminsidebar from "../sidebar/Adminsidebar";
import { getAllMessagesApi, markMessageAsReadApi, respondToMessageApi, getMessageCountApi } from "../../../api/api";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [counts, setCounts] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [messagesRes, countRes] = await Promise.all([
        getAllMessagesApi(),
        getMessageCountApi()
      ]);
      
      setMessages(messagesRes.data?.data || []);
      const countData = countRes.data?.data || { totalMessages: 0, unreadMessages: 0 };
      setCounts({
        total: countData.totalMessages,
        unread: countData.unreadMessages
      });
    } catch (err) {
      setError("Unable to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await markMessageAsReadApi(id);
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
      loadData();
    } catch (err) {
      setError("Unable to mark as read");
    }
  };

  const sendResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      setResponding(true);
      await respondToMessageApi(selectedMessage.id, responseText);
      
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id ? { 
          ...msg, 
          adminResponse: responseText,
          respondedAt: new Date().toISOString(),
          isRead: true 
        } : msg
      ));
      
      setResponseText("");
      setSelectedMessage(null);
      setSuccess("Response sent!");
      loadData();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Unable to send response");
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="min-h-screen flex text-white">
      <Adminsidebar />

      <main className="flex-1 bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white">📬 Student Messages</h1>
            <p className="text-gray-300 text-sm mt-1">
              View and respond to messages from students.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="bg-blue-500 bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-blue-300 text-sm">Total: {counts.total}</span>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="text-yellow-300 text-sm">Unread: {counts.unread}</span>
              </div>
            </div>
          </header>

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

          {loading ? (
            <div className="text-center text-gray-300">
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">
              <p>No messages from students yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 backdrop-blur-md p-6 rounded-2xl shadow-lg border ${
                    msg.isRead ? 'border-gray-600' : 'border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{msg.subject}</h3>
                      <p className="text-gray-400 text-sm">From: {msg.studentName}</p>
                      <p className="text-gray-500 text-xs">{msg.studentEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        msg.isRead ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                      }`}>
                        {msg.isRead ? 'Read' : 'Unread'}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{msg.message}</p>
                  </div>

                  {msg.adminResponse && (
                    <div className="mb-4 p-3 bg-green-500 bg-opacity-20 rounded-lg">
                      <p className="text-xs text-green-300 mb-1">Your Response:</p>
                      <p className="text-white text-sm">{msg.adminResponse}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!msg.isRead && (
                      <button
                        onClick={() => markRead(msg.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition text-sm"
                      >
                        Mark Read
                      </button>
                    )}
                    {!msg.adminResponse && (
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md transition text-sm"
                      >
                        Respond
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-30 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-600">
              <h3 className="text-xl font-semibold text-white mb-4">
                Respond to: {selectedMessage.subject}
              </h3>
              
              <div className="mb-4">
                <p className="text-white text-sm mb-2">From: {selectedMessage.studentName}</p>
                <p className="text-gray-300 text-sm mb-3">{selectedMessage.message}</p>
              </div>

              <form onSubmit={sendResponse}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 rounded-md bg-gradient-to-br from-purple-900 via-indigo-900 bg-opacity-20 border border-gray-600 text-white focus:outline-none focus:border-indigo-400"
                    placeholder="Type your response..."
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={responding}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-2 px-4 rounded-md transition"
                  >
                    {responding ? "Sending..." : "Send Response"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages; 