import request from 'supertest';
import { connect, closeDatabase, clearDatabase } from './test-utils';
import app from '../app';
import Telemetry from '../models/Telemetry';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe('POST /api/telemetry', () => {
  it('should save valid telemetry data', async () => {
    const payload = {
      droneId: 'DRN001',
      timestamp: '2025-04-29T22:30:00Z',
      eventType: 'takeoff',
      statusCode: 200,
      telemetryData: {
        location: { latitude: 37.7749, longitude: -122.4194 },
      },
    };

    const res = await request(app).post('/api/telemetry').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.totalReceived).toBe(1);
    expect(res.body.insertedCount).toBe(1);
    expect(res.body.invalidCount).toBe(0);

    const saved = await Telemetry.findOne({ droneId: 'DRN001' });
    expect(saved).not.toBeNull();
    expect(saved?.isValid).toBe(true);
  });

  it('should save invalid telemetry data with errors', async () => {
    const payload = {
      droneId: '',
      timestamp: new Date('invalid-date'),
      eventType: '',
      statusCode: 'not-a-number',
      telemetryData: {
        location: { latitude: 0, longitude: 0 },
      },
    };

    const res = await request(app).post('/api/telemetry').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.totalReceived).toBe(1);
    expect(res.body.insertedCount).toBe(1);
    expect(res.body.invalidCount).toBe(1);

    const saved = await Telemetry.findOne({});
    expect(saved).not.toBeNull();
    expect(saved?.isValid).toBe(false);
    expect(saved?.validationErrors.length).toBeGreaterThan(0);
  });
});

describe('GET /api/telemetry/:droneId', () => {
  it('should return telemetry records for a drone', async () => {
    await Telemetry.create({
      droneId: 'DRN001',
      timestamp: new Date(),
      eventType: 'takeoff',
      statusCode: 200,
      telemetryData: { location: { latitude: 37.7, longitude: -122.4 } },
      isValid: true,
      validationErrors: [],
    });

    const res = await request(app).get('/api/telemetry/DRN001');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].droneId).toBe('DRN001');
  });

  it('should return 404 if no records found', async () => {
    const res = await request(app).get('/api/telemetry/UNKNOWN');

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/No records found/);
  });
});
