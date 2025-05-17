import { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;