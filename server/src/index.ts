import express, { type Express } from 'express';
import mongoose from 'mongoose';
import financialRecordRouter from './routes/financial-records.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
const mongoURI = 'mongodb+srv://ayomidekay7_db_user:j8V1GYTk1ng0NvBC@pocketflow0.a8u6lz7.mongodb.net/';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/financial-records', financialRecordRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});