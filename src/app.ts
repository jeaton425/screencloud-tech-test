import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import telemetryRoutes from './routes/telemetry';

const app = express();
app.use(bodyParser.json());

const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/dronedata';

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', telemetryRoutes);

export default app;
