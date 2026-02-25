import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { authRouter } from './modules/auth/auth.router';
import { eventsRouter } from './modules/events/events.router';
import { tagsRouter } from './modules/tags/tags.router';
import { swaggerUiHandler, swaggerSetup } from './swagger';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tags', tagsRouter);

app.use('/api-docs', swaggerUiHandler, swaggerSetup);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
  console.log(`DB: ${config.DB_HOST}:${config.DB_PORT} / ${config.DB_NAME} (user: ${config.DB_USER})`);
});
