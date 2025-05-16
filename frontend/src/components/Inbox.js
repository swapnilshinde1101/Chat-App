import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chats } from '../api';
import Conversation from './Conversation';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'unread'
  const [chatList, setChatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await chats.getUserChats(currentUser.id);
        setChatList(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, [currentUser]);

  const filteredChats = chatList.filter(chat => {
    const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = viewMode === 'unread' ? chat.unreadCount > 0 : true;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="inbox-container">
      <div className="sidebar">
        <div className="header">
          <h3>Chats</h3>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="all">All Chats</option>
            <option value="unread">Unread</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="chat-list">
          {filteredChats.map(chat => (
            <div
              key={chat.user.id}
              className={`chat-item ${chat.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => setSelectedUser(chat.user)}
            >
              <span>{chat.user.name}</span>
              {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="conversation-panel">
        {selectedUser ? (
          <Conversation user={selectedUser} />
        ) : (
          <div className="empty-state">Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
};

export default Inbox;