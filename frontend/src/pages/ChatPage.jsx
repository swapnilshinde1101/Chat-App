import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiLogOut, FiSearch, FiUser } from 'react-icons/fi';
import ChatInput from '../components/ChatInput';


function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [viewMode, setViewMode] = useState('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to load user:', err);
        navigate('/login');
      }
    };

    fetchProfile();
    fetchConversations();
  }, [token, navigate]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleConversationSelect = (userId) => {
    setSelectedConversation(userId);
    fetchMessages(userId);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.username.toLowerCase().includes(searchQuery.toLowerCase());
    return viewMode === 'unread'
      ? matchesSearch && conv.unreadCount > 0
      : matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="w-full md:w-80 lg:w-96 border-r bg-white flex flex-col shadow-lg">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="flex items-center justify-between mb-4 text-white">
            <div className="flex items-center space-x-2">
              <FiMessageSquare className="w-6 h-6" />
              <h1 className="text-xl font-bold">{currentUser?.username}</h1>
            </div>
            <Link 
              to="/login" 
              className="p-2 hover:bg-white/10 rounded-full"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setViewMode('unread')}
              className={`flex-1 p-2 rounded-lg ${
                viewMode === 'unread' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 p-2 rounded-lg ${
                viewMode === 'all' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              All
            </button>
          </div>
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-white/80" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div
              key={conv.userId}
              onClick={() => handleConversationSelect(conv.userId)}
              className={`p-4 border-b cursor-pointer ${
                selectedConversation === conv.userId 
                  ? 'bg-blue-50/50' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{conv.username}</h3>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2.5 py-1 text-xs font-medium">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Conversation with {conversations.find(c => c.userId === selectedConversation)?.username}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === currentUser?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl shadow-sm ${
                      msg.sender === currentUser?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-2">
            <FiMessageSquare className="w-16 h-16" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
