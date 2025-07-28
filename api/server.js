// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');  // Authentication routes
const eventRoutes = require('./routes/eventRoutes');  // Event management routes
const taskRoutes = require('./routes/taskRoutes');  // Task management routes
const uploadRoutes = require('./routes/uploadRoutes');  // File upload route

const app = express();
const PORT = parseInt(process.env.PORT) || 8080;

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cookieParser());  // Parse cookies

// Trust the first proxy when running behind Vercel/Render
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}

const allowedOrigins = [
  'http://localhost:3000',
  'https://socialsync-omega.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
  

// ✅ Register API Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/events', eventRoutes);  // Event management routes
app.use('/api/tasks', taskRoutes);  // Task management routes
app.use('/api/upload', uploadRoutes);  // File upload route

// ✅ Simple API Test Route (`/ping`)
app.get('/api/ping', (req, res) => {
    res.json({ message: "API is working!" });
});

// ✅ Database Connection Test
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/api/test-db', async (req, res) => {
    try {
        const users = await prisma.user.findMany(); // Fetch users from DB
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// ✅ Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Test route working" });
});

// ✅ Simple POST test route
app.post('/api/test-post', (req, res) => {
  res.json({ message: "POST request received", data: req.body });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
