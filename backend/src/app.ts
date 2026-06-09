import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import healthRouter from './routes/health';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(helmet());
app.use(json());

app.use('/health', healthRouter);

export default app;
