import Telemetry, { ITelemetry } from '../models/Telemetry.js';

export function validateRecord(record: Partial<ITelemetry>): string[] {
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

export async function saveTelemetryRecords(
  records: Partial<ITelemetry>[]
): Promise<ITelemetry[]> {
  return Telemetry.insertMany(records, { ordered: false });
}

export async function getTelemetryByDroneId(droneId: string): Promise<ITelemetry[]> {
  return Telemetry.find({ droneId }).sort({ timestamp: -1 });
}
