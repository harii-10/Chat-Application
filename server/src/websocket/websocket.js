const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

class WebSocketManager {
  constructor() {
    this.clients = new Map(); // userId -> Set of WebSocket connections
    this.onlineUsers = new Set(); // Set of online userIds
  }

  addClient(userId, ws) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(ws);
    this.onlineUsers.add(userId);
    this.broadcastOnlineUsers();
  }

  removeClient(userId, ws) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).delete(ws);
      if (this.clients.get(userId).size === 0) {
        this.clients.delete(userId);
        this.onlineUsers.delete(userId);
        this.broadcastOnlineUsers();
      }
    }
  }

  broadcastOnlineUsers() {
    const onlineUsersArray = Array.from(this.onlineUsers);
    const message = JSON.stringify({
      type: 'online_users',
      users: onlineUsersArray
    });

    this.clients.forEach((connections) => {
      connections.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(message);
        }
      });
    });
  }

  sendToUser(userId, message) {
    if (this.clients.has(userId)) {
      const messageStr = JSON.stringify(message);
      this.clients.get(userId).forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(messageStr);
        }
      });
    }
  }

  broadcastToAll(message) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((connections) => {
      connections.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(messageStr);
        }
      });
    });
  }
}

const wsManager = new WebSocketManager();

const handleWebSocket = (ws, req) => {
  let userId = null;

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'auth':
          try {
            const decoded = jwt.verify(message.token, process.env.JWT_SECRET);
            userId = decoded.userId;
            wsManager.addClient(userId, ws);
            
            // Send confirmation
            ws.send(JSON.stringify({
              type: 'auth_success',
              userId
            }));
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'auth_error',
              message: 'Invalid token'
            }));
            ws.close();
          }
          break;

        case 'send_message':
          if (!userId) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Not authenticated'
            }));
            return;
          }

          const { receiverId, content } = message;
          
          // Save message to DB
          const newMessage = new Message({
            sender: userId,
            receiver: receiverId,
            content: content.trim()
          });
          await newMessage.save();
          await newMessage.populate('sender', 'username');
          await newMessage.populate('receiver', 'username');

          // Send to receiver
          wsManager.sendToUser(receiverId, {
            type: 'new_message',
            message: newMessage
          });

          // Send confirmation to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: newMessage
          }));
          break;

        case 'typing':
          if (!userId) return;
          const { receiverId: typingReceiverId, isTyping } = message;
          wsManager.sendToUser(typingReceiverId, {
            type: 'typing',
            senderId: userId,
            isTyping
          });
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    if (userId) {
      wsManager.removeClient(userId, ws);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (userId) {
      wsManager.removeClient(userId, ws);
    }
  });
};

module.exports = { handleWebSocket, wsManager };