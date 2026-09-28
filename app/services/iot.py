"""
Looks up the most recent IoT sensor reading for a zone+signal, if one
exists and is fresh enough to trust. Used by app/services/prediction.py
to prefer real sensor data over the public API estimate whenever a
device has actually reported in recently.

No sensor has reported for a zone/signal? Returns None, and the
prediction pipeline falls back to Open-Meteo/Open-Elevation as before —
this is additive, not a replacement for the public data sources.
"""

from datetime import datetime, timezone, timedelta
from app.db import get_connection

FRESHNESS_MINUTES = 30


def get_recent_reading(zone_id: str, sensor_type: str) -> float | None:
    conn = get_connection()
    row = conn.execute(
        "SELECT value, recorded_at FROM iot_readings "
        "WHERE zone_id = ? AND sensor_type = ? "
        "ORDER BY recorded_at DESC LIMIT 1",
        (zone_id, sensor_type),
    ).fetchone()
    conn.close()

    if not row:
        return None

    recorded_at = datetime.fromisoformat(row["recorded_at"])
    if recorded_at.tzinfo is None:
        recorded_at = recorded_at.replace(tzinfo=timezone.utc)

    age = datetime.now(timezone.utc) - recorded_at
    if age > timedelta(minutes=FRESHNESS_MINUTES):
        return None  # stale — treat as if no reading exists

    return row["value"]
