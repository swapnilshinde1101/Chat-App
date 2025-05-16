import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim() === '') return;
    onSend(message);
    setMessage('');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ padding: '10px', width: '70%' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
