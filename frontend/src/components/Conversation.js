import { useState, useEffect } from 'react';
import { messages } from '../api';
import ChatInput from './ChatInput';

const Conversation = ({ user }) => {
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        const messagesRes = await messages.getConversation(user.id);
        setMessageList(messagesRes.data || []);
        await messages.markConversationAsRead(user.id);
      } catch (error) {
        console.error(error);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadConversation();
    }
  }, [user]);

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    try {
      const res = await messages.sendMessage({
        receiverId: user.id,
        content: messageText,
      });

      setMessageList((prev) => [...prev, res.data]);
    } catch (error) {
      console.error(error);
      setError('Failed to send message');
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Loading messages...</div>;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h3 className="text-lg font-medium">Conversation with {user.username}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messageList.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${
              msg.sender === user.id
                ? 'bg-gray-200 mr-auto'
                : 'bg-blue-500 text-white ml-auto'
            }`}
          >
            <p>{msg.content}</p>
            <p
              className={`text-xs mt-1 ${
                msg.sender === user.id ? 'text-gray-500' : 'text-blue-100'
              }`}
            >
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Conversation;
