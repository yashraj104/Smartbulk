
require('dotenv').config();

console.log("🔑 OpenAI API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const dietPlannerRoute = require('./routes/dietRoute');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ✅ Fix: trust proxy so express-rate-limit works correctly
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS and body parsing
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/diet-planner", dietPlannerRoute);

// In-memory stores (in production, use Redis or database)
const posts = [];
const challenges = [];
const connectedUsers = new Map();

// --- Socket.IO connection handling ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    connectedUsers.set(socket.id, userId);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on('send_message', (data) => {
    const { roomId, message, sender } = data;
    io.to(roomId).emit('receive_message', {
      id: uuidv4(),
      content: message,
      sender,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('post_interaction', (data) => {
    const { postId, type, userId } = data;
    io.emit('post_updated', { postId, type, userId });
  });

  socket.on('challenge_update', (data) => {
    const { challengeId, userId, progress } = data;
    io.emit('challenge_updated', { challengeId, userId, progress });
  });

  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(socket.id);
      console.log(`User ${userId} disconnected`);
    }
  });
});

// --- Community Routes ---
app.get('/api/community/posts', (req, res) => res.json(posts));

app.post('/api/community/posts', (req, res) => {
  const { user, content, type, image, tags } = req.body;
  if (!content || !user) return res.status(400).json({ error: 'Missing required fields' });

  const newPost = {
    id: uuidv4(),
    user,
    content,
    type: type || 'achievement',
    image: image || '',
    tags: Array.isArray(tags) ? tags : [],
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: new Date().toISOString(),
    liked: false,
    bookmarked: false,
    commentsList: []
  };

  posts.unshift(newPost);
  io.emit('new_post', newPost);
  res.status(201).json(newPost);
});

app.post('/api/community/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.likes += 1;
  io.emit('post_liked', { postId: post.id, likes: post.likes });
  res.json(post);
});

app.post('/api/community/posts/:id/comment', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { user, content } = req.body;
  if (!content || !user) return res.status(400).json({ error: 'Missing required fields' });

  const comment = { id: uuidv4(), user, content, timestamp: new Date().toISOString() };
  post.commentsList.push(comment);
  post.comments = post.commentsList.length;

  io.emit('new_comment', { postId: post.id, comment });
  res.status(201).json(comment);
});

// --- Challenges Routes ---
app.get('/api/challenges', (req, res) => res.json(challenges));

app.post('/api/challenges', (req, res) => {
  const { name, description, type, difficulty, duration, target, unit, reward } = req.body;
  if (!name || !description || !type || !difficulty || !duration || !target || !unit || !reward) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newChallenge = {
    id: uuidv4(),
    name,
    description,
    type,
    difficulty,
    duration,
    target,
    unit,
    reward,
    participants: [],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
    rules: [],
    dailyTargets: []
  };

  challenges.push(newChallenge);
  io.emit('new_challenge', newChallenge);
  res.status(201).json(newChallenge);
});

app.post('/api/challenges/:id/join', (req, res) => {
  const { userId, username } = req.body;
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

  if (challenge.participants.find(p => p.userId === userId)) {
    return res.status(400).json({ error: 'Already joined this challenge' });
  }

  const participant = {
    userId,
    username,
    joinedDate: new Date().toISOString(),
    progress: 0,
    currentStreak: 0,
    bestStreak: 0
  };

  challenge.participants.push(participant);
  io.emit('challenge_joined', { challengeId: challenge.id, participant });
  res.json(participant);
});

// --- AI Chat Route ---
const openaiApiKey = process.env.OPENAI_API_KEY;
let openaiClient = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
const conversationHistory = new Map();

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, personality, userId, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    if (!openaiClient) {
      return res.json({
        reply: "Fallback mode: AI service not available",
        context: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    let messages = [];
    const systemMessages = {
      'motivational': "You are an enthusiastic fitness coach...",
      'technical': "You are a technical fitness expert...",
      'friendly': "You are a supportive fitness companion...",
      'strict': "You are a strict, no-nonsense coach..."
    };
    messages.push({ role: 'system', content: systemMessages[personality] || systemMessages['motivational'] });

    if (userId && conversationHistory.has(userId)) {
      messages.push(...conversationHistory.get(userId).slice(-10));
    }
    messages.push({ role: 'user', content: message });
    if (context) messages.push({ role: 'system', content: `Context: ${context}` });

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Sorry, I could not generate a response.";

    if (userId) {
      if (!conversationHistory.has(userId)) conversationHistory.set(userId, []);
      const history = conversationHistory.get(userId);
      history.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
      if (history.length > 20) conversationHistory.set(userId, history.slice(-20));
    }

    res.json({ reply, context: 'ai', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "AI service error", context: 'error' });
  }
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      ai: !!openaiClient,
      realtime: true,
      community: true,
      challenges: true
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
// Matches all routes (safe for Express v5)
app.use((req, res) => res.status(404).json({ error: "Endpoint not found" }));


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🤖 AI Service: ${openaiClient ? 'Connected' : 'Fallback Mode'}`);
  console.log(`🌐 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
