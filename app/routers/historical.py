from fastapi import APIRouter, Depends
from app.db import get_connection
from app.deps import get_current_user
from app.models.schemas import HistoricalEventOut, HistoricalEventIn

router = APIRouter(prefix="/api", tags=["historical"])


def _row_to_event(row) -> HistoricalEventOut:
    return HistoricalEventOut(
        id=row["id"],
        year=row["year"],
        date=row["date"],
        title=row["title"],
        location=row["location"],
        rainfall=row["rainfall"],
        riverStatus=row["river_status"],
        impact=row["impact"],
        verified=bool(row["verified"]),
    )


@router.get("/historical/events", response_model=list[HistoricalEventOut])
async def list_events():
    """Real, publicly documented events plus any illustrative placeholders
    you've added — seeded on first run with Kedarnath (2013) and Chamoli
    (2021). See app/db.py's init_db() for the seed data and its sourcing
    note."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM historical_events ORDER BY year DESC, date DESC"
    ).fetchall()
    conn.close()
    return [_row_to_event(r) for r in rows]


@router.post("/historical/events", response_model=HistoricalEventOut)
async def upsert_event(payload: HistoricalEventIn):
    """Add or update a historical event. Set verified=true ONLY for
    real, sourced events — don't use this to add fabricated statistics
    about real disasters. For illustrative placeholders, set
    verified=false and say so in the impact text."""
    conn = get_connection()
    conn.execute(
        "INSERT OR REPLACE INTO historical_events "
        "(id, year, date, title, location, rainfall, river_status, impact, verified) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            payload.id,
            payload.year,
            payload.date,
            payload.title,
            payload.location,
            payload.rainfall,
            payload.riverStatus,
            payload.impact,
            int(payload.verified),
        ),
    )
    conn.commit()
    conn.close()
    return HistoricalEventOut(**payload.model_dump())
