import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token and set user
      fetchUserProfile(token);
    }
  }, [token]);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setCurrentView('chat');
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'register':
        return <Register onSwitchToLogin={() => setCurrentView('login')} onRegister={handleLogin} />;
      case 'chat':
        return <Chat user={user} token={token} onLogout={handleLogout} />;
      default:
        return <Login onSwitchToRegister={() => setCurrentView('register')} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderView()}
    </div>
  );
}

export default App;
