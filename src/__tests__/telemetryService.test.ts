import { connect, closeDatabase, clearDatabase } from './test-utils';
import Telemetry from '../models/Telemetry';
import { validateRecord, saveTelemetryRecords, getTelemetryByDroneId } from '../services/telemetryService';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe('validateRecord', () => {
  it('should return errors for invalid record', () => {
    const record = {
      droneId: '',
      timestamp: new Date('invalid-date'),
      eventType: '',
      statusCode: NaN,
      telemetryData: {
        location: { latitude: 0, longitude: 0 },
      },
    };

    const errors = validateRecord(record);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('Missing droneId');
    expect(errors).toContain('Invalid or missing timestamp');
  });

  it('should return empty array for valid record', () => {
    const record = {
      droneId: 'DRN001',
      timestamp: new Date(),
      eventType: 'takeoff',
      statusCode: 200,
      telemetryData: { location: { latitude: 37, longitude: -122 } },
    };

    const errors = validateRecord(record);
    expect(errors).toHaveLength(0);
  });
});

describe('saveTelemetryRecords and getTelemetryByDroneId', () => {
  it('should save and retrieve telemetry records', async () => {
    const records = [
      {
        droneId: 'DRN001',
        timestamp: new Date(),
        eventType: 'takeoff',
        statusCode: 200,
        telemetryData: { location: { latitude: 37, longitude: -122 } },
        isValid: true,
        validationErrors: [],
      },
    ];

    const saved = await saveTelemetryRecords(records);
    expect(saved.length).toBe(1);

    const fetched = await getTelemetryByDroneId('DRN001');
    expect(fetched.length).toBe(1);
    expect(fetched[0].droneId).toBe('DRN001');
  });
});
