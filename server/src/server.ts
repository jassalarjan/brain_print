import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/database';
import questionsRoutes from './routes/questions.routes';
import scoreRoutes from './routes/score.routes';
import profileRoutes from './routes/profile.routes';
import benchmarkRoutes from './routes/benchmark.routes';
import evolutionRoutes from './routes/evolution.routes';
import teamRoutes from './routes/team.routes';
import pairingRoutes from './routes/pairing.routes';
import authRoutes from './routes/auth.routes';
import memoryRoutes from './routes/memory.routes';
import chatRoutes from './routes/chat.routes';
import triggerRoutes from './routes/trigger.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/trigger', triggerRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/session/score', scoreRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/benchmark', benchmarkRoutes);
app.use('/api/evolution', evolutionRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/pairing', pairingRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
