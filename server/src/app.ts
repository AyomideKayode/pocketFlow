import 'dotenv/config';
import express, { type Express } from 'express';
import financialRecordRouter from './routes/financial-records.js';
import reportsRouter from './routes/reports.js';
import budgetRouter from './routes/budget.js';
import goalRouter from './routes/goal.js';
import userProfileRouter from './routes/user-profile.js';
import cloudinaryRouter from './routes/cloudinary.js';
import cors from 'cors';

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://pocket-flow-kay.vercel.app',
    ],
    credentials: true,
  }),
);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/financial-records', financialRecordRouter);
app.use('/reports', reportsRouter);
app.use('/budgets', budgetRouter);
app.use('/goals', goalRouter);
app.use('/user-profile', userProfileRouter);
app.use('/cloudinary', cloudinaryRouter);

export default app;
