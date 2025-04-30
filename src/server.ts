import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Telemetry, { ITelemetry } from './models/Telemetry.js';

const app = express();
app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dronedata';

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

function validateRecord(record: Partial<ITelemetry>): string[] {
  const errors: string[] = [];

  if (!record.droneId) errors.push('Missing droneId');
  if (!record.timestamp || isNaN(new Date(record.timestamp).getTime()))
    errors.push('Invalid or missing timestamp');
  if (!record.eventType) errors.push('Missing eventType');
  if (typeof record.statusCode !== 'number')
    errors.push('Missing or invalid statusCode');

  const loc = record.telemetryData?.location;
  if (!loc) {
    errors.push('Missing telemetryData.location');
  } else {
    if (
      typeof loc.latitude !== 'number' ||
      loc.latitude < -90 ||
      loc.latitude > 90
    )
      errors.push('Invalid latitude');
    if (
      typeof loc.longitude !== 'number' ||
      loc.longitude < -180 ||
      loc.longitude > 180
    )
      errors.push('Invalid longitude');
  }

  return errors;
}

app.post('/api/telemetry', async (req: Request, res: Response) => {
  const data = Array.isArray(req.body) ? req.body : [req.body];

  const recordsToSave: Partial<ITelemetry>[] = data.map((record) => {
    const errors = validateRecord(record);
    return {
      ...record,
      timestamp: record.timestamp ? new Date(record.timestamp) : null,
      isValid: errors.length === 0,
      validationErrors: errors,
    };
  });

  try {
    await Telemetry.insertMany(recordsToSave);
    res.status(200).json({
      message: 'Telemetry data processed',
      total: recordsToSave.length,
      invalid: recordsToSave.filter((r) => !r.isValid).length,
    });
  } catch (err) {
    console.error('Error saving telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/telemetry/:droneId', async (req: Request, res: Response): Promise<void> => {
  const { droneId } = req.params;

  try {
    const records = await Telemetry.find({ droneId }).sort({ timestamp: -1 });
    if (records.length === 0) {
      res.status(404).json({ message: `No records found for droneId ${droneId}` });
      return;
    }
    res.json(records);
  } catch (err) {
    console.error('Error fetching telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
