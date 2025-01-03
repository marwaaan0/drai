import * as dotenv from 'dotenv';
// Load environment variables before other imports
dotenv.config({ path: '.env' });

import express from 'express';
import cors from 'cors';
import path from 'path';
import chatRoutes from './routes/chat';
import authRoutes from './routes/auth';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ 
    status: 'healthy', 
    name: 'Draxen AI', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route handler
app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to Draxen AI API',
    status: 'online',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      auth: '/api/auth'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Try to start server on preferred port, fallback to another if taken
const startServer = (retryCount = 0) => {
  const currentPort = Number(port) + retryCount;
  
  try {
    httpServer.listen(currentPort, () => {
      console.log(`🤖 Draxen AI Server running on port ${currentPort}`);
      console.log(`🌐 API Documentation available at http://localhost:${currentPort}`);
      console.log('🔒 CORS enabled for origins:', allowedOrigins.join(', '));
      
      // Update client's environment if port changed
      if (currentPort !== Number(port)) {
        console.log(`⚠️  Default port ${port} was in use, using port ${currentPort} instead`);
        console.log(`📝 Please update the client's .env VITE_API_URL to use port ${currentPort}`);
      }
    });
  } catch (error) {
    if (retryCount < 10) {
      console.log(`Port ${currentPort} is in use, trying port ${currentPort + 1}...`);
      startServer(retryCount + 1);
    } else {
      console.error('Could not find an available port after 10 attempts');
      process.exit(1);
    }
  }
};

startServer();
