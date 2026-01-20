import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatWidget = () => {
  // --- STATE MANAGEMENT ---
  const [isOpen, setIsOpen] = useState(false); // Chatbox open/close state
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi there! 👋 Main Gemini hoon. Bataiye aaj kya madad karun?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-scroll ke liye ref
  const messagesEndRef = useRef(null);

  // API Key (Apni Key yahan dalein)
  const API_KEY = "9e42475700786e1fa0cdb019f1cd0891";

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isOpen]);

  // --- HANDLERS ---
  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- CHAT WINDOW (Floating Card) --- */}
      {isOpen && (
        <div className="position-fixed bottom-2 end-0 m-4 mb-5" style={{ zIndex: 1000, width: '350px', bottom: '70px' }}>
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            
            {/* Header */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-robot fs-4"></i>
                <div>
                  <h6 className="mb-0 fw-bold">AI Assistant</h6>
                  <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online</small>
                </div>
              </div>
              <button onClick={toggleChat} className="btn btn-sm btn-outline-light border-0">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Message Body */}
            <div className="card-body bg-light overflow-auto p-3" style={{ height: '400px' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="me-2 align-self-end">
                      <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '30px', height: '30px'}}>
                        <i className="bi bi-stars text-primary" style={{fontSize: '12px'}}></i>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`p-3 shadow-sm text-break ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-3 rounded-bottom-end-0' 
                        : 'bg-white text-dark rounded-3 rounded-bottom-start-0'
                    }`}
                    style={{ maxWidth: '85%', fontSize: '0.95rem' }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                   <div className="bg-white p-3 rounded-3 shadow-sm">
                      <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm text-primary mx-1" role="status"></div>
                      <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="card-footer bg-white p-3 border-top-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill ps-3"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center" 
                  style={{ width: '40px', height: '40px' }}
                  onClick={handleSend}
                  disabled={isLoading}
                >
                  <i className="bi bi-send-fill" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- TOGGLE BUTTON (Circle Icon) --- */}
      <button
        onClick={toggleChat}
        className="position-fixed bottom-0 end-0 m-4 btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: '60px', height: '60px', zIndex: 1000, transition: 'transform 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className={`bi ${isOpen ? 'bi-chevron-down' : 'bi-chat-dots-fill'}`} style={{ fontSize: '24px' }}></i>
      </button>
    </>
  );
};

export default ChatWidget;