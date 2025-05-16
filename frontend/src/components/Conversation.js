// components/Conversation.js
import { useState, useEffect } from 'react';
import { messages } from '../api';

const Conversation = ({ user }) => {
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        setLoading(true);
        const response = await messages.getMessages(user.id);
        setMessageList(response.data);
      } catch (error) {
        setError('Failed to load message history');
      } finally {
        setLoading(false);
      }
    };

    if (user) loadMessageHistory();
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await messages.sendMessage(user.id, newMessage);
      setMessageList([...messageList, response.data]);
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="conversation-container">
      {/* Message list rendering */}
      <div className="message-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};