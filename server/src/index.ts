import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tags', tagRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;