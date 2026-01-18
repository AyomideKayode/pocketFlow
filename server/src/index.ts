import mongoose from 'mongoose';
import app from './app.js';
import { startExportWorker } from './services/exportService.js';

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    startExportWorker();
    app.listen(PORT, () => {
      console.log(`Server is up: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
