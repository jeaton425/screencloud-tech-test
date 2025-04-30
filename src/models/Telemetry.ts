import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface ITelemetryData {
  location: ILocation;
}

export interface ITelemetry extends Document {
  droneId?: string;
  timestamp?: Date | null;
  eventType?: string;
  statusCode?: number;
  telemetryData?: ITelemetryData;
  isValid: boolean;
  validationErrors: string[];
}

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
});

const TelemetrySchema = new Schema<ITelemetry>({
  droneId: { type: String },
  timestamp: { type: Date },
  eventType: { type: String },
  statusCode: { type: Number },
  telemetryData: {
    location: { type: LocationSchema },
  },
  isValid: { type: Boolean, default: true },
  validationErrors: { type: [String], default: [] },
});

TelemetrySchema.index({ droneId: 1, timestamp: 1 });

export default mongoose.model<ITelemetry>('Telemetry', TelemetrySchema);
