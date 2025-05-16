function ChatWindow() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${userId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [userId]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Conversation with {userId}</h3>
        <a href="/inbox">Back to Inbox</a>
      </div>
      
      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
            <span>{msg.timestamp}</span>
          </div>
        ))}
      </div>
      
      <div className="message-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;