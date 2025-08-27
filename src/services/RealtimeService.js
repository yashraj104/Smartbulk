import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

class RealtimeService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(userId = null) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    // Check if backend service is available before connecting
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    
    // Don't attempt connection if we're in production and no backend URL is set
    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_BACKEND_URL) {
      console.warn('No backend URL configured for production, skipping real-time connection');
      return null;
    }

    try {
      this.socket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000, // Reduced timeout
        reconnection: true,
        reconnectionAttempts: 3, // Reduced attempts
        reconnectionDelay: 2000,
        forceNew: true, // Force new connection
      });

      this.socket.on('connect', () => {
        console.log('Connected to real-time server');
        this.isConnected = true;
        
        if (userId) {
          this.socket.emit('join', userId);
        }
        
        // Only show success toast in development or if explicitly requested
        if (process.env.NODE_ENV === 'development') {
          toast.success('Connected to real-time updates', { duration: 2000 });
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time server');
        this.isConnected = false;
        // Only show disconnect error if it was an unexpected disconnect
        if (process.env.NODE_ENV === 'development') {
          toast.error('Lost connection to real-time updates', { duration: 2000 });
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        // Don't show toast for connection errors in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to connect to real-time updates');
        }
      });

      // Handle real-time updates
      this.socket.on('new_post', (post) => {
        this.notifyListeners('new_post', post);
        toast.success('New community post!', {
          icon: '📝',
          duration: 3000,
        });
      });

      this.socket.on('post_liked', (data) => {
        this.notifyListeners('post_liked', data);
      });

      this.socket.on('new_comment', (data) => {
        this.notifyListeners('new_comment', data);
        toast.success('New comment on a post!', {
          icon: '💬',
          duration: 3000,
        });
      });

      this.socket.on('new_challenge', (challenge) => {
        this.notifyListeners('new_challenge', challenge);
        toast.success('New challenge available!', {
          icon: '🏆',
          duration: 4000,
        });
      });

      this.socket.on('challenge_joined', (data) => {
        this.notifyListeners('challenge_joined', data);
        toast.success('Someone joined a challenge!', {
          icon: '👥',
          duration: 3000,
        });
      });

      this.socket.on('challenge_updated', (data) => {
        this.notifyListeners('challenge_updated', data);
      });

      this.socket.on('receive_message', (message) => {
        this.notifyListeners('receive_message', message);
      });

    } catch (error) {
      console.error('Failed to connect to real-time server:', error);
      toast.error('Failed to connect to real-time updates');
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Subscribe to real-time events
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Send real-time messages
  sendMessage(roomId, message, sender) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', { roomId, message, sender });
    }
  }

  // Update post interactions
  updatePostInteraction(postId, type, userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('post_interaction', { postId, type, userId });
    }
  }

  // Update challenge progress
  updateChallengeProgress(challengeId, userId, progress) {
    if (this.socket && this.isConnected) {
      this.socket.emit('challenge_update', { challengeId, userId, progress });
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
