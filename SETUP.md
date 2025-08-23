# SmartBulk Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartbulk
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Frontend Environment Variables
   REACT_APP_BACKEND_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id_here
   ```

   Create a `.env` file in the backend directory:
   ```env
   # Backend Environment Variables
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # OpenAI Configuration (Optional - for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the development servers**

   In one terminal (backend):
   ```bash
   cd backend
   npm start
   ```

   In another terminal (frontend):
   ```bash
   npm start
   ```

## 🔧 Configuration

### Firebase Setup (Optional)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Firestore
4. Get your configuration keys
5. Add them to your `.env` file

### OpenAI API Setup (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get an API key
3. Add the API key to your backend `.env` file
4. The AI coach will work with fallback responses if no API key is provided

## 🌟 Features

### Real-time Features
- **Live Community Feed**: Real-time posts, likes, and comments
- **Live Challenges**: Real-time challenge updates and participant notifications
- **AI Chat**: Enhanced with conversation history and real-time responses
- **Connection Status**: Visual indicators for real-time connection status

### Enhanced Error Handling
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Toast Notifications**: Real-time feedback for user actions
- **Fallback Responses**: AI features work even without API keys
- **Loading States**: Better user experience with loading indicators

### Security Features
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Error Logging**: Comprehensive error logging for debugging

## 🛠️ Development

### Available Scripts

**Frontend:**
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure
```
smartbulk/
├── src/
│   ├── components/          # React components
│   ├── services/           # API and real-time services
│   ├── contexts/           # React contexts
│   └── hooks/              # Custom hooks
├── backend/
│   ├── routes/             # API routes
│   └── server.js           # Express server
└── public/                 # Static files
```

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in your hosting platform

### Backend (Heroku/Railway)
1. Deploy the `backend` folder
2. Set environment variables in your hosting platform
3. Ensure the frontend URL is correctly configured

## 📝 Troubleshooting

### Common Issues

1. **Real-time features not working**
   - Check if backend server is running
   - Verify CORS settings
   - Check browser console for errors

2. **AI chat not responding**
   - Verify OpenAI API key is set
   - Check network connectivity
   - Fallback responses should work without API key

3. **Firebase authentication issues**
   - Verify Firebase configuration
   - Check if authentication is enabled in Firebase console

### Getting Help
- Check the browser console for errors
- Check the backend server logs
- Ensure all environment variables are set correctly
- Verify all dependencies are installed

## 🎉 What's New

### Version 2.0 Updates
- ✅ Real-time community feed with live updates
- ✅ Real-time challenges with participant notifications
- ✅ Enhanced AI chat with conversation history
- ✅ Better error handling and user feedback
- ✅ Connection status indicators
- ✅ Toast notifications for user actions
- ✅ Improved security with rate limiting
- ✅ Fallback responses for AI features
- ✅ Better loading states and user experience

### Coming Soon
- 🔄 Real-time workout tracking
- 🔄 Live leaderboards
- 🔄 Push notifications
- 🔄 Advanced AI features
- 🔄 Mobile app
