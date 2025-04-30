import { Request, Response } from 'express';
import {
  validateRecord,
  saveTelemetryRecords,
  getTelemetryByDroneId,
} from '../services/telemetryService.js';
import { ITelemetry } from '../models/Telemetry.js';

export async function postTelemetry(req: Request, res: Response): Promise<void> {
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const data = Array.isArray(req.body) ? req.body : [req.body];

  const recordsToSave: Partial<ITelemetry>[] = data.map((record) => {
    const errors = validateRecord(record);
    return {
      droneId: record.droneId ?? null,
      timestamp: record.timestamp ? new Date(record.timestamp) : null,
      eventType: record.eventType ?? null,
      statusCode: typeof record.statusCode === 'number' ? record.statusCode : null,
      telemetryData: record.telemetryData ?? null,
      isValid: errors.length === 0,
      validationErrors: errors,
    };
  });

  try {
    const result = await saveTelemetryRecords(recordsToSave);
    res.status(200).json({
      message: 'Telemetry data processed',
      totalReceived: recordsToSave.length,
      insertedCount: result.length,
      invalidCount: recordsToSave.filter((r) => !r.isValid).length,
    });
  } catch (err) {
    console.error('Error saving telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getTelemetry(req: Request, res: Response): Promise<void> {
  const { droneId } = req.params;

  try {
    const records = await getTelemetryByDroneId(droneId);
    if (records.length === 0) {
      res.status(404).json({ message: `No records found for droneId ${droneId}` });
      return;
    }
    res.json(records);
  } catch (err) {
    console.error('Error fetching telemetry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
