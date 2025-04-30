import { Router } from 'express';
import { postTelemetry, getTelemetry } from '../controllers/telemetryController.js';

const router = Router();

router.post('/telemetry', postTelemetry);
router.get('/telemetry/:droneId', getTelemetry);

export default router;
