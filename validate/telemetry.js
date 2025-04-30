function validateRecord(record) {
  const errors = [];

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
