from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from app.data.zones import ZONES
from app.db import get_connection
from app.deps import get_current_user
from app.models.schemas import IoTReadingIn, IoTReadingOut, IoTZoneStatus
from app.services.iot import FRESHNESS_MINUTES

router = APIRouter(prefix="/api", tags=["iot"], dependencies=[Depends(get_current_user)])

# NOTE on auth: ingestion currently requires the same JWT a human
# operator uses (Astra's login). That's fine for testing with curl, but
# a real sensor deployment should use per-device API keys instead of a
# shared human login — add a separate `device_tokens` table and a
# lighter-weight auth dependency for this router when you get there.


@router.post("/iot/readings", response_model=IoTReadingOut)
async def ingest_reading(payload: IoTReadingIn):
    """A sensor (or a test script) pushes one reading here. The
    prediction pipeline (app/services/prediction.py) automatically
    prefers the most recent reading for a zone+signal over the public
    API estimate, as long as it's less than FRESHNESS_MINUTES old."""
    now = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    conn.execute(
        "INSERT INTO iot_readings (zone_id, sensor_type, value, recorded_at, device_id) "
        "VALUES (?, ?, ?, ?, ?)",
        (payload.zone_id, payload.sensor_type, payload.value, now, payload.device_id),
    )
    conn.commit()
    conn.close()
    return IoTReadingOut(
        zone_id=payload.zone_id,
        sensor_type=payload.sensor_type,
        value=payload.value,
        recorded_at=now,
        device_id=payload.device_id,
    )


@router.get("/iot/readings", response_model=list[IoTReadingOut])
async def list_readings(zone_id: str | None = None, limit: int = 50):
    """Recent raw readings, optionally filtered to one zone. Useful for
    debugging a sensor feed or building a history chart later."""
    conn = get_connection()
    if zone_id:
        rows = conn.execute(
            "SELECT * FROM iot_readings WHERE zone_id = ? "
            "ORDER BY recorded_at DESC LIMIT ?",
            (zone_id, limit),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM iot_readings ORDER BY recorded_at DESC LIMIT ?", (limit,)
        ).fetchall()
    conn.close()
    return [
        IoTReadingOut(
            zone_id=r["zone_id"],
            sensor_type=r["sensor_type"],
            value=r["value"],
            recorded_at=r["recorded_at"],
            device_id=r["device_id"],
        )
        for r in rows
    ]


@router.get("/iot/status", response_model=list[IoTZoneStatus])
async def iot_status():
    """Per-zone connectivity: does this town have a live sensor feeding
    it data right now, or is it running purely on the public API
    estimate? Powers the Data Sources page's IoT section."""
    conn = get_connection()
    statuses: list[IoTZoneStatus] = []

    for zone in ZONES:
        rows = conn.execute(
            "SELECT sensor_type, recorded_at FROM iot_readings "
            "WHERE zone_id = ? ORDER BY recorded_at DESC LIMIT 20",
            (zone.id,),
        ).fetchall()

        if rows:
            latest = rows[0]["recorded_at"]
            recorded_at = datetime.fromisoformat(latest)
            if recorded_at.tzinfo is None:
                recorded_at = recorded_at.replace(tzinfo=timezone.utc)
            age_minutes = (datetime.now(timezone.utc) - recorded_at).total_seconds() / 60
            statuses.append(
                IoTZoneStatus(
                    zone_id=zone.id,
                    zone_name=zone.name,
                    connected=age_minutes <= FRESHNESS_MINUTES,
                    last_reading_at=latest,
                    sensor_types=sorted({r["sensor_type"] for r in rows}),
                )
            )
        else:
            statuses.append(
                IoTZoneStatus(zone_id=zone.id, zone_name=zone.name, connected=False)
            )

    conn.close()
    return statuses
