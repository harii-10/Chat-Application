# Real-Time MERN Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) using WebSockets for instant messaging.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens and bcrypt password hashing
- **Real-Time Messaging**: Instant message delivery using WebSockets (no Socket.io)
- **Online Presence**: See which users are currently online
- **Persistent Storage**: All messages stored in MongoDB
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Scalable Architecture**: Clean separation of concerns with modular backend structure

## 🛠 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Native WebSocket API** for real-time communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **WebSockets** using the `ws` library
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database
- **MongoDB** (local or cloud)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `.env.example` to `.env` in the server directory
   - Update the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/chatapp
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
     CLIENT_URL=http://localhost:5174
     ```

5. **Start MongoDB**
   - Ensure MongoDB is running locally on port 27017, or update `MONGODB_URI` for cloud MongoDB

## 🚀 Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on http://localhost:5000

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on http://localhost:5174

3. **Open your browser**
   - Navigate to http://localhost:5174
   - Register two users in different browser tabs/windows
   - Start chatting in real-time!

## 📖 Usage

1. **Registration/Login**: Create accounts or log in with existing credentials
2. **User Selection**: Choose a user from the sidebar to start a conversation
3. **Real-Time Chat**: Send messages that appear instantly for both users
4. **Online Status**: Green indicators show which users are currently online

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)

### Messages
- `GET /api/messages/:userId` - Get messages with a specific user (protected)
- `POST /api/messages` - Send a message (protected)

### WebSocket Events
- `auth` - Authenticate WebSocket connection
- `send_message` - Send a message
- `typing` - Typing indicators (optional)

## 🏗 System Architecture

### WebSocket Connection Flow
1. Client connects to WebSocket server
2. Client sends JWT token for authentication
3. Server validates token and associates connection with user
4. Messages are routed through WebSocket for real-time delivery
5. Online presence is broadcast to all connected clients

### Database Schema
- **Users**: username, email, password (hashed), createdAt
- **Messages**: sender, receiver, content, timestamp, read status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- WebSocket connection validation
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using the MERN stack and WebSockets