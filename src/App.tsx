import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Check for saved login state
  useEffect(() => {
    const savedUser = localStorage.getItem('brd_user');
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('brd_user', user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('brd_user');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <ChatInterface username={username} onLogout={handleLogout} />;
}

export default App;