import { useState, useEffect } from 'react';
import { messages } from '../api';

const Conversation = ({ user }) => {
  const [messageList, setMessageList] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messages.getMessages(user.id);
        setMessageList(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await messages.sendMessage(user.id, newMessage);
      setMessageList([...messageList, {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="conversation-container">
      <div className="header">
        <h4>Conversation with {user.name}</h4>
      </div>
      <div className="messages">
        {messageList.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;