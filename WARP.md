# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Frontend Development (React App)
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Backend Development (Express Server)
```bash
# Start backend in development mode (with nodemon)
cd backend
npm run dev

# Start backend in production mode
cd backend
npm start
```

### Full Stack Development
```bash
# Start both frontend and backend simultaneously
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm start
```

### Android App Development
```bash
# Navigate to android app and install dependencies
cd android-app
npm install

# Start Metro bundler
npm start

# Run on Android (separate terminal)
npm run android

# Build release APK
cd android/
./gradlew assembleRelease
```

## High-Level Architecture

### Core Application Structure
SmartBulk is a full-stack AI-powered fitness platform with three main components:
1. **React Frontend** - Progressive Web App with real-time features
2. **Express Backend** - REST API with Socket.IO for real-time communication
3. **React Native Android App** - Mobile companion app

### Key Architectural Patterns

#### Frontend Architecture (React)
- **Component Structure**: Lazy-loaded components for performance optimization
- **State Management**: React Context (AuthContext) + local state with hooks
- **Real-time Communication**: Socket.IO client for live updates
- **Routing**: React Router with protected routes
- **Styling**: Bootstrap 5 + custom CSS with dark mode support
- **Error Handling**: ErrorBoundary components with toast notifications

#### Backend Architecture (Express)
- **API Structure**: RESTful routes with Express middleware
- **Real-time Features**: Socket.IO server for live community feed, challenges, and chat
- **Security**: Helmet, CORS, rate limiting, and request validation
- **AI Integration**: OpenAI API for fitness coaching (with fallbacks)
- **Data Storage**: In-memory stores (production should use Redis/database)

#### Data Layer
- **Firebase Services**: 
  - Authentication (email/password + Google OAuth)
  - Firestore for user profiles and app data
  - Storage for file uploads
- **Real-time Service**: Custom Socket.IO service for live features
- **Firestore Service**: Comprehensive data access layer for all app entities

### Service Architecture

#### Core Services
- **RealtimeService**: Manages Socket.IO connections, subscriptions, and real-time updates
- **FirestoreService**: Database operations for users, measurements, workouts, goals
- **DietPlannerService**: Automatic diet planning with macro calculations
- **AuthContext**: Firebase authentication state management
- **FoodDatabaseService**: Nutrition database and food calculations

#### Key Features by Component
- **Community Feed**: Real-time posts, likes, comments with live notifications
- **AI Chat Coach**: OpenAI-powered fitness assistant with conversation history
- **Progress Tracking**: Chart.js visualizations with Firebase data persistence
- **Workout/Diet Planning**: Automated planning based on user goals and preferences
- **Challenges System**: Real-time fitness challenges with participant tracking

### Environment Configuration

#### Required Environment Variables
**Frontend (.env)**:
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

### Development Workflow

#### Component Development
- All components are lazy-loaded for performance
- Use React Bootstrap for UI consistency
- Implement error boundaries for robust error handling
- Follow the established dark mode theming pattern

#### Real-time Features
- Use RealtimeService for all Socket.IO operations
- Subscribe to events in useEffect with proper cleanup
- Handle connection status and provide fallbacks

#### Data Operations
- Use FirestoreService for all database operations
- Implement proper loading states and error handling
- Batch operations when possible for performance

#### Authentication Flow
- AuthContext provides centralized auth state
- Firestore profiles are automatically created/updated
- Support both email/password and Google OAuth

### Testing and Deployment

#### Frontend Deployment
- Build with `npm run build`
- Deploy to Netlify/Vercel with proper environment variables
- Configure redirects for SPA routing

#### Backend Deployment
- Use `npm start` for production
- Deploy to Heroku/Railway with environment configuration
- Ensure proper CORS settings for frontend domain

#### Mobile App Deployment
- Build release APK with `./gradlew assembleRelease`
- Build App Bundle with `./gradlew bundleRelease` for Google Play
- Update version numbers in package.json and build.gradle

### Common Development Patterns

#### Error Handling
- Use toast notifications for user feedback
- Implement try-catch blocks with meaningful error messages
- Provide fallbacks for external service failures (AI features)

#### Performance Optimization
- Lazy load all route components
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets

#### Security Considerations
- Never commit API keys or sensitive data
- Use environment variables for all configuration
- Implement proper input validation
- Use HTTPS in production
- Implement rate limiting for API endpoints

### Monetization Features
The app includes comprehensive monetization strategies:
- Premium subscriptions with tiered pricing
- Trainer marketplace with commission system
- In-app purchases for premium content
- Referral program implementation
- Equipment affiliate sales integration

### Mobile App Integration
The Android app mirrors web functionality with:
- Complete React Native implementation
- Native Android configuration
- Shared API endpoints with web version
- Monetization features fully integrated
