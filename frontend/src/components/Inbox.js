import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chats, messages } from '../api';
import Conversation from './Conversation';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        
        // Get all messages involving current user
        const allMessages = await messages.getAllMessages();
        
        // Extract unique user IDs from conversations
        const participantIds = [
          ...new Set(allMessages.data.map(msg => 
            msg.senderId === currentUser.id ? msg.receiverId : msg.senderId
          ))
        ];
        
        // Get user details for each participant
        const participants = await Promise.all(
          participantIds.map(id => users.getUserById(id))
        );
        
        // Build chat list with unread counts
        const chatList = participants.map(user => {
          const userMessages = allMessages.data.filter(
            msg => msg.senderId === user.id || msg.receiverId === user.id
          );
          
          return {
            user: user.data,
            lastMessage: userMessages[0]?.content,
            unreadCount: userMessages.filter(
              msg => msg.receiverId === currentUser.id && !msg.isRead
            ).length
          };
        });
        
        setChatList(chatList);
      } catch (error) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatData();
  }, [currentUser]);
  

  const filteredChats = chatList.filter(chat => {
    const matchesSearch = chat.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = viewMode === 'unread' ? chat.unreadCount > 0 : true;
    return matchesSearch && matchesMode;
  });

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Loading chats...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">Chats</h3>
          <div className="flex mt-2">
            <select 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="all">All Chats</option>
              <option value="unread">Unread</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 p-2 border rounded flex-1"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.user.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                chat.unreadCount > 0 ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(chat.user)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{chat.user.username}</p>
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
          ))}
        </div>
      </div>
      
      {/* Conversation Panel */}
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