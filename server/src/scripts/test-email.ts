import 'dotenv/config';
import mongoose from 'mongoose';
import { emailService } from '../services/email.service.js';

async function run() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MONGODB_URI is not set. Cannot run full integration test.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const recipient = {
      userId: 'test-user-' + Date.now(),
      email: 'ayomidekay7@gmail.com',
      displayName: 'Ayo Mi De'
    };

    console.log('Sending test email to:', recipient.email);

    // We expect this to use ConsoleProvider by default unless EMAIL_PROVIDER is set
    const success = await emailService.sendTransactionEmail(
      recipient,
      'test-notification',
      { name: recipient.displayName, message: 'Direct script test' },
      'alerts'
    );

    console.log('Email Send Result:', success ? 'SUCCESS' : 'FAILURE');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

run();
