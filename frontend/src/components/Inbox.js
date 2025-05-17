import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messages } from '../api';
import Conversation from './Conversation';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await messages.getConversations();
        setChatList(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchConversations();
    }
  }, [currentUser?.id]);

  const filteredChats = chatList.filter((chat) => {
    const username = chat?.username?.toLowerCase() || '';
    return (
      username.includes(searchQuery.toLowerCase()) &&
      (viewMode === 'all' || chat.unreadCount > 0)
    );
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Loading chats...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">Chats</h3>
          <div className="flex mt-2 space-x-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="p-2 border rounded w-1/2"
            >
              <option value="all">All Chats</option>
              <option value="unread">Unread</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded w-1/2"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-gray-500">No chats found.</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={`${chat.userId}-${chat.username}`}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  chat.unreadCount > 0 ? 'bg-blue-50' : ''
                }`}
                onClick={() =>
                  setSelectedUser({
                    id: chat.userId,
                    username: chat.username,
                  })
                }
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{chat.username}</p>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <Conversation user={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
