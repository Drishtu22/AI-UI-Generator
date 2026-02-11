import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import agentRoutes from './routes/agentroutes.js';
import versionRoutes from './routes/versionRoutes.js';

// Load env variables - ONCE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agent', agentRoutes);
app.use('/api/versions', versionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    message: 'Ryze AI Backend is running'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ryze AI Backend API',
    endpoints: {
      health: '/api/health',
      generate: '/api/agent/generate',
      modify: '/api/agent/modify',
      versions: '/api/versions'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ryze AI Backend running on port ${PORT}`);
});