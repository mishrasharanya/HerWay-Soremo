import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';

const ChatbotPanel = ({ selectedNeighborhood }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Quick summary of this area',
    'Is it safe at night?',
    'Top 3 safety tips',
    'Best times to visit'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildContext = () => {
    if (!selectedNeighborhood) {
      return 'You are HerWay, a Chicago neighborhood guide. Be brief. User needs to select a neighborhood first.';
    }
    
    const n = selectedNeighborhood;
    return `You are HerWay, a friendly Chicago neighborhood guide.

RULES:
- Keep responses to 2-3 short sentences MAX
- Use bullet points for lists
- Be helpful, not scary
- No long paragraphs

NEIGHBORHOOD: ${n.neighborhood}
- Incidents/year: ${n.crime_total_incidents || 'N/A'}
- Common issues: ${n.crime_top_types || 'N/A'}
- Peak time: ${n.crime_peak_hour || 'N/A'} on ${n.crime_peak_day || 'N/A'}s
- Night incidents: ${n.crime_night_pct || 'N/A'}%
- 311 complaints: ${n.requests_311_total || 'N/A'}
- Top complaint: ${n.most_common_complaint || 'N/A'}

Answer concisely in 2-3 sentences.`;
  };

  // Format response with basic styling
  const formatResponse = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
          return <div key={i} className="chat-bullet">{line.trim().substring(1).trim()}</div>;
        }
        // Numbered lists
        if (/^\d+\./.test(line.trim())) {
          return <div key={i} className="chat-bullet">{line.trim()}</div>;
        }
        // Empty lines
        if (!line.trim()) return <br key={i} />;
        // Regular text
        return <p key={i} style={{ margin: '4px 0' }}>{line}</p>;
      });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const prompt = `${buildContext()}\n\nUser: ${text}\n\nAssistant (keep it brief):`;
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 150  // Limits response length
          }
        })
      });

      if (!response.ok) throw new Error('Failed');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'Sorry, no response.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Connection error. Is Ollama running?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt) => handleSendMessage(prompt);
  const handleSubmit = (e) => { e.preventDefault(); handleSendMessage(inputValue); };
  const clearChat = () => setMessages([]);

  if (!isOpen) {
    return (
      <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
        <Sparkles size={22} />
        <span>Ask HerWay</span>
      </button>
    );
  }

  return (
    <div className="chatbot-panel">
      <div className="chatbot-header">
        <div className="chatbot-header-icon">
          <Sparkles size={20} />
          <span>HerWay</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {messages.length > 0 && (
            <button className="chatbot-close" onClick={clearChat} style={{ fontSize: '11px', padding: '5px 10px' }}>
              Clear
            </button>
          )}
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="chatbot-body">
        {messages.length === 0 ? (
          <>
            <div className="chatbot-welcome">
              <div className="welcome-icon">🗺️</div>
              <h3>Explore Chicago</h3>
              <p>Click a neighborhood, then ask me anything</p>
            </div>

            {selectedNeighborhood ? (
              <div className="chatbot-context selected">
                <div className="chatbot-context-label">📍 Selected</div>
                <div className="chatbot-context-value">{selectedNeighborhood.neighborhood}</div>
              </div>
            ) : (
              <div className="chatbot-context empty">
                <div className="chatbot-context-label">No area selected</div>
                <div className="chatbot-context-value">Tap a neighborhood on the map</div>
              </div>
            )}

            <div className="suggested-prompts">
              {suggestedPrompts.map((prompt, idx) => (
                <button key={idx} className="suggested-prompt" onClick={() => handlePromptClick(prompt)} disabled={isLoading}>
                  {prompt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {selectedNeighborhood && (
              <div className="chatbot-context selected compact">
                <span>📍 {selectedNeighborhood.neighborhood}</span>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === 'assistant' ? formatResponse(msg.content) : msg.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message assistant loading-msg">
                <Loader2 size={16} className="spinner" />
                <span>Thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="chatbot-input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chatbot-send" disabled={!inputValue.trim() || isLoading}>
          {isLoading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default ChatbotPanel;