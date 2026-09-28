"""
Lightweight SQLite persistence — historical flood events and IoT sensor
readings. Deliberately simple (stdlib sqlite3, synchronous): at this
scale (a handful of towns, occasional sensor pushes) a full async ORM
would be over-engineering. If this grows into a real multi-user,
high-throughput deployment, swap this for Postgres + SQLAlchemy/asyncpg
— the router code only talks to the small functions below, so that
swap wouldn't touch route logic.

The .db file itself is git-ignored (see .gitignore) — it's runtime
state, not source. init_db() creates the schema and seeds real,
well-documented historical events on first run.
"""

import sqlite3
import pathlib

DB_PATH = pathlib.Path(__file__).parent / "data" / "floodguard.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_connection()

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS historical_events (
            id TEXT PRIMARY KEY,
            year TEXT NOT NULL,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            rainfall TEXT NOT NULL DEFAULT 'UNKNOWN',
            river_status TEXT NOT NULL DEFAULT 'UNKNOWN',
            impact TEXT NOT NULL,
            verified INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS iot_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            zone_id TEXT NOT NULL,
            sensor_type TEXT NOT NULL,
            value REAL NOT NULL,
            recorded_at TEXT NOT NULL,
            device_id TEXT
        )
        """
    )
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_iot_zone_type_time "
        "ON iot_readings (zone_id, sensor_type, recorded_at DESC)"
    )
    conn.commit()

    # Seed with real, publicly documented events only — no invented
    # statistics about real disasters. See app/routers/historical.py.
    existing = conn.execute("SELECT COUNT(*) AS c FROM historical_events").fetchone()["c"]
    if existing == 0:
        seed = [
            (
                "hist-kedarnath-2013", "2013", "June 2013",
                "Kedarnath Flash Floods", "Kedarnath", "UNKNOWN", "UNKNOWN",
                "Real, widely documented disaster — intense monsoon rainfall combined "
                "with glacial lake dynamics triggered catastrophic flash flooding in "
                "the Mandakini valley.",
                1,
            ),
            (
                "hist-chamoli-2021", "2021", "February 2021",
                "Chamoli Glacial Flood", "Chamoli", "UNKNOWN", "UNKNOWN",
                "Real, widely documented disaster — a glacier/rock-ice avalanche "
                "triggered a sudden flash flood down the Rishiganga and Dhauliganga "
                "rivers in the Alaknanda system.",
                1,
            ),
        ]
        conn.executemany(
            "INSERT INTO historical_events "
            "(id, year, date, title, location, rainfall, river_status, impact, verified) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            seed,
        )
        conn.commit()

    conn.close()
