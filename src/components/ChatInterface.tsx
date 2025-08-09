import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Trash2, Code, FileText, Sparkles } from 'lucide-react';
import ChatMessage, { Message } from './ChatMessage';

interface ChatInterfaceProps {
  username: string;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ username, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello ${username}! I'm your BRD Assistant, specialized in helping you with Business Requirements Document analysis, improvements, and code generation. 

I can help you with:
• Analyzing and improving BRD documents
• Generating technical specifications
• Writing code based on requirements
• Reviewing and optimizing existing requirements
• Creating user stories and acceptance criteria

How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('implement') || lowerMessage.includes('function')) {
      return `I can help you generate code based on your requirements. Here's a sample implementation:

\`\`\`javascript
// Example: User Authentication Function
function authenticateUser(username, password) {
  // Validate input parameters
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.length >= 3 && password.length >= 6) {
        resolve({
          success: true,
          user: { username, id: Date.now() },
          token: 'jwt-token-here'
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}
\`\`\`

Would you like me to modify this code or generate something specific for your requirements?`;
    }
    
    if (lowerMessage.includes('brd') || lowerMessage.includes('requirement') || lowerMessage.includes('business')) {
      return `Great! Let me help you with your Business Requirements Document. Here are the key areas I can assist with:

**BRD Structure & Components:**
• Executive Summary & Business Objectives
• Functional & Non-functional Requirements
• User Stories & Acceptance Criteria
• Technical Specifications & Constraints
• Risk Assessment & Mitigation Strategies

**BRD Best Practices:**
• Clear, measurable requirements
• Stakeholder identification and sign-off
• Traceability matrix implementation
• Change management procedures

What specific aspect of your BRD would you like to focus on? Please share your current requirements or challenges.`;
    }
    
    if (lowerMessage.includes('improve') || lowerMessage.includes('optimize') || lowerMessage.includes('review')) {
      return `I'd be happy to help improve your requirements! For effective BRD optimization, I recommend:

**Quality Checklist:**
✓ Requirements are specific, measurable, and testable
✓ Business value is clearly articulated
✓ Dependencies and constraints are identified
✓ Acceptance criteria are well-defined
✓ Stakeholder roles and responsibilities are clear

**Common Improvements:**
• Add priority levels (Must-have, Should-have, Could-have)
• Include user persona definitions
• Specify performance and scalability requirements
• Add security and compliance requirements
• Define data management and migration needs

Please share your current requirements document or specific sections you'd like me to review and improve.`;
    }

    return `Thank you for your message! As your BRD Assistant, I'm here to help with:

• **Requirements Analysis**: Review and improve existing BRDs
• **Code Generation**: Transform requirements into functional code
• **Documentation**: Create comprehensive technical specifications
• **Best Practices**: Apply industry standards to your requirements

Could you please provide more details about your specific needs? For example:
- Do you have an existing BRD to review?
- Are you starting a new project and need requirements gathering?
- Do you need help translating requirements into technical specifications?

The more context you provide, the better I can assist you!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const isCode = botResponse.includes('```');
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: isCode ? botResponse.replace(/```\w*\n?/g, '').replace(/```/g, '') : botResponse,
        timestamp: new Date(),
        isCode: isCode,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: `Conversation cleared! I'm still here to help you with your BRD requirements, analysis, and code generation. What would you like to work on?`,
        timestamp: new Date(),
      },
    ]);
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `[${msg.timestamp.toLocaleString()}] ${msg.type === 'user' ? 'You' : 'BRD Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brd-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">BRD Assistant</h1>
            <p className="text-sm text-gray-500">Business Requirements & Code Generation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={exportConversation}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export conversation"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={clearConversation}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <span className="text-sm text-gray-600">Welcome, {username}</span>
          <button
            onClick={onLogout}
            className="ml-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex gap-4 p-4 bg-gray-50/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">BRD Assistant is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about BRD requirements, improvements, or request code generation..."
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <Code className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setInputValue('Help me analyze my BRD document')}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              Analyze BRD
            </button>
            <button
              onClick={() => setInputValue('Generate code for user authentication')}
              className="px-3 py-1 text-xs bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
            >
              Generate Code
            </button>
            <button
              onClick={() => setInputValue('Improve my functional requirements')}
              className="px-3 py-1 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
            >
              Improve Requirements
            </button>
            <button
              onClick={() => setInputValue('Create user stories from requirements')}
              className="px-3 py-1 text-xs bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
            >
              Create User Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;