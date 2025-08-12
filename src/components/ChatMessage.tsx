import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isDarkMode?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode = false }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isBot = message.type === 'bot';

  return (
    <div className={`flex gap-4 p-4 ${
      isDarkMode
        ? isBot ? 'bg-gray-800/50' : 'bg-gray-800'
        : isBot ? 'bg-gray-50/50' : 'bg-white'
    } transition-all duration-200 hover:bg-opacity-80`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
          : 'bg-gradient-to-r from-emerald-600 to-teal-600'
      }`}>
        {isBot ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isBot ? 'BRD Assistant' : 'You'}
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          {message.isCode ? (
            <div className="relative bg-gray-900 rounded-lg p-4 mt-2">
              <button
                onClick={() => copyToClipboard(message.content)}
                className="absolute top-2 right-2 p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="text-sm text-gray-100 overflow-x-auto pr-8">
                <code>{message.content}</code>
              </pre>
            </div>
          ) : (
            <div className={`leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;