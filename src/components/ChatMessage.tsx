import React from 'react';
import { User, Bot, Copy, Check, Download, FileText, Image, FileJson, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isCode?: boolean;
  downloadUrl?: string;
  imageUrl?: string;
}

interface ChatMessageProps {
  message: Message;
  isDarkMode?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode = false }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Extract filename from URL or create one based on timestamp
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1] || `Analysis_${new Date().toISOString()}`;
      a.download = decodeURIComponent(filename);
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileTypeIcon = (url: string) => {
    if (url.toLowerCase().endsWith('.pdf')) return <FileText className="w-4 h-4" />;
    if (url.toLowerCase().endsWith('.json')) return <FileJson className="w-4 h-4" />;
    if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) return <Image className="w-4 h-4" />;
    return <Download className="w-4 h-4" />;
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
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isBot ? 'BRD Assistant' : 'You'}
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {message.imageUrl && (
              <button
                onClick={() => handleDownload(message.imageUrl!)}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-800'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 disabled:bg-emerald-50'
                } transition-colors disabled:cursor-not-allowed`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Downloading Image...</span>
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    <span>Download Image</span>
                  </>
                )}
              </button>
            )}
            
            {message.downloadUrl && (
              <button
                onClick={() => handleDownload(message.downloadUrl!)}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:bg-blue-50'
                } transition-colors disabled:cursor-not-allowed`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    {getFileTypeIcon(message.downloadUrl)}
                    <span>Download Analysis</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          {message.imageUrl && (
            <div className={`mb-4 relative ${!imageLoaded ? 'min-h-[200px]' : ''}`}>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={message.imageUrl}
                alt="Generated Analysis"
                className={`rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
          
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