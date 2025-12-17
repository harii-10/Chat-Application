import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

const Chat = ({ user, token, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  useEffect(() => {
    fetchUsers();
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Authenticate
      ws.send(JSON.stringify({
        type: 'auth',
        token: token
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'auth_success':
          console.log('Authenticated');
          break;
        case 'online_users':
          setOnlineUsers(data.users);
          break;
        case 'new_message':
          if (selectedUser && (data.message.sender._id === selectedUser._id || data.message.receiver._id === user.id)) {
            setMessages(prev => [...prev, data.message]);
          }
          break;
        case 'message_sent':
          setMessages(prev => [...prev, data.message]);
          break;
          break;
        case 'typing':
          // Handle typing indicators if needed
          break;
        case 'auth_error':
          console.error('Auth error:', data.message);
          onLogout();
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const sendMessage = (content) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && selectedUser) {
      wsRef.current.send(JSON.stringify({
        type: 'send_message',
        receiverId: selectedUser._id,
        content
      }));
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
          <button
            onClick={onLogout}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            Logout
          </button>
        </div>
        
        {/* User List */}
        <UserList
          users={users}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          currentUser={user}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={sendMessage}
            currentUser={user}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium">Select a user to start chatting</h3>
              <p>Choose someone from the sidebar to begin a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;