# FloodGuard AI — Backend (Tier 2: trained ML model)

A FastAPI backend that computes flash-flood risk for real locations along
Uttarakhand's Ganga headwaters (Bhagirathi, Alaknanda, Mandakini valleys)
using live public data and a **trained RandomForestClassifier**.

## 1. What this does

For each monitored location it:

1. Fetches last-6h rainfall and trend from **Open-Meteo** (forecast API)
2. Fetches near-surface soil moisture from **Open-Meteo** (soil moisture variable)
3. Fetches river discharge and its rate of change from the **Open-Meteo Flood API**
4. Fetches a terrain-steepness proxy from **Open-Elevation**
5. Normalizes each signal to 0–1 and runs it through a **trained classifier**
   (`app/ml/model.joblib`) to get a flood probability, a confidence score,
   and a LOW/MODERATE/HIGH/CRITICAL classification
6. Returns it in the exact shape the FloodGuard AI frontend expects

No API keys are required for any of the live data sources.

**Read this before you present the model's "accuracy" anywhere**: there is
no public labeled historical flood dataset bundled here. The classifier is
trained on a *synthetic, domain-informed* dataset — see the big docstring
at the top of `app/ml/train_model.py` for exactly what that means and
doesn't mean. It's a real, working scikit-learn pipeline (real train/test
split, real cross-validation, real metrics) — what's synthetic is the
ground truth it learned from, not the model or the process.

## 2. Setup

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # adjust CORS origin if your frontend runs elsewhere
```

### Train the model

A pre-trained `model.joblib` ships in `app/ml/`, but you should retrain
it locally too (and definitely on every deploy — see section 3):

```bash
python -m app.ml.train_model
```

This prints validation metrics (accuracy, precision, recall, F1, ROC-AUC,
feature importances) and writes `app/ml/model.joblib` + `app/ml/metrics.json`.

### Set Astra's login password

Auth is enabled on all data routes (`/api/predictions`, `/api/locations`,
`/api/alerts`, `/api/geography`, `/api/historical/*`, `/api/iot/*`). There's
a single operator account — username `Astra`. Set your own password
(never committed in plaintext):

```bash
python scripts/generate_hash.py "your-chosen-password"
```

Copy the printed hash into `.env` as `ASTRA_PASSWORD_HASH`, and generate a
random JWT signing secret:

```bash
python scripts/generate_jwt_secret.py
```

Copy that into `.env` as `JWT_SECRET_KEY`.

## 3. Run

```bash
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive Swagger docs.

### Deploying (Render, etc.)

- **Runtime**: `runtime.txt` pins Python 3.11.9 — scikit-learn and several
  other dependencies here don't have prebuilt wheels for very new Python
  versions (3.13+), which causes slow from-source builds or outright
  failures on constrained build environments. Don't remove this file.
- **Build command**: retrain the model as part of every deploy, so the
  saved model always matches whatever scikit-learn version actually got
  installed (avoids joblib/pickle version-mismatch issues across
  environments):
  ```
  pip install -r requirements.txt && python -m app.ml.train_model
  ```
- **Start command**:
  ```
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

## 4. Connect the frontend

In the frontend project, create `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

(For a deployed frontend, point this at your deployed backend URL instead
of localhost, and make sure `CORS_ORIGINS` in this backend's `.env`
matches the frontend's real deployed URL.)

The response shapes in `app/models/schemas.py` are written to match
`src/types/index.ts` field-for-field, so no frontend component changes
are needed beyond what's already there.

## 5. Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | `{username, password}` → JWT access token |
| GET | `/api/auth/me` | Returns the current authenticated username |
| GET | `/api/predictions` | Live prediction for every configured zone |
| POST | `/api/predict` | On-demand prediction for an arbitrary `{latitude, longitude}` |
| GET | `/api/locations` | Zones enriched with current risk (for the GIS map) |
| GET | `/api/risk-map` | Same as `/locations` — kept separate so it can diverge later |
| GET | `/api/alerts` | Alerts derived live from zones currently at MODERATE+ risk |
| GET | `/api/geography` | Static basin geometry — river course(s), roads, settlements, map center |
| GET | `/api/model/metrics` | Validation accuracy/precision/recall/F1/ROC-AUC/feature importances |
| GET | `/api/historical/events` | Real + illustrative historical events (SQLite-backed) |
| POST | `/api/historical/events` | Add or update a historical event |
| POST | `/api/iot/readings` | Ingest a sensor reading `{zone_id, sensor_type, value, device_id?}` |
| GET | `/api/iot/readings` | Recent raw readings, optionally filtered by `zone_id` |
| GET | `/api/iot/status` | Per-zone: is a live sensor currently feeding this location? |
| GET | `/health` | Liveness check — no external calls, useful for confirming the app itself is up |

## 6. Monitored locations

Real towns along the Ganga headwaters in Uttarakhand — not a fictional
basin. This is a genuine flash-flood risk corridor: Kedarnath (2013) and
Chamoli (2021) are real, well-known disaster sites in this exact river
system.

| Zone | River valley |
|---|---|
| Dehradun, Rishikesh, Haridwar | Ganga plains |
| Devprayag | Confluence — traditional source of the Ganga |
| Srinagar (Garhwal), Rudraprayag, Chamoli, Joshimath | Alaknanda valley |
| New Tehri, Uttarkashi | Bhagirathi valley |
| Kedarnath | Mandakini valley |

Coordinates are approximate town centers, not surveyed GPS points.

## 7. The ML model (Tier 2)

- **Algorithm**: `RandomForestClassifier` (scikit-learn), 250 trees, max
  depth 6, class-balanced.
- **Features** (same 4 the Tier 1 formula used): normalized rainfall,
  river signal, soil moisture, slope.
- **Outputs**: `probability` (P(flood) × 100) and `confidence` (how sure
  the model is of *whichever* class it picked — not the same thing as
  probability; a model can be 95% confident risk is LOW).
- **Training data**: synthetic, domain-informed (see `app/ml/train_model.py`
  docstring). Swap in real historical records by replacing
  `generate_synthetic_dataset()` — nothing else needs to change.
- **Fallback**: if `model.joblib` is missing or fails to load, the API
  automatically falls back to the original Tier 1 weighted formula
  (`app/services/scoring.py`) rather than failing requests.
- **Retraining**: `python -m app.ml.train_model`. Do this any time you
  change the feature engineering, the synthetic data assumptions, or
  (eventually) plug in real historical data.

## 8. Historical events

Real, publicly documented events (Kedarnath 2013, Chamoli 2021) are
seeded into a SQLite database on first run (`app/db.py`), alongside any
illustrative placeholders you add. Add more via:

```bash
curl -X POST http://localhost:8000/api/historical/events \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "hist-example-2020",
    "year": "2020",
    "date": "August 2020",
    "title": "Example Event",
    "location": "Rudraprayag",
    "impact": "Description here.",
    "verified": true
  }'
```

Set `"verified": true` only for real, sourced events. Don't use this to
add fabricated statistics about real disasters — for illustrative
placeholders, set `"verified": false` and say so in the impact text.

Real sources for historical records worth integrating: NDMA (National
Disaster Management Authority), Uttarakhand State Disaster Management
Authority, India-WRIS (Water Resources Information System), IMD
historical rainfall archives.

## 9. IoT sensor data

A real ingestion endpoint for physical sensors (rain gauges,
water-level sensors, soil-moisture probes). The prediction pipeline
automatically prefers a fresh IoT reading over the public API estimate,
per zone and per signal, whenever one exists (`app/services/iot.py`,
30-minute freshness window).

**Push a reading:**

```bash
curl -X POST http://localhost:8000/api/iot/readings \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "kedarnath",
    "sensor_type": "rainfall_mm_6h",
    "value": 62.5,
    "device_id": "rain-gauge-01"
  }'
```

`sensor_type` must be one of: `rainfall_mm_6h`, `soil_moisture_pct`,
`river_discharge_m3s`, `river_discharge_rate`. `zone_id` must match an ID
in `app/data/zones.py` (e.g. `kedarnath`, `chamoli`, `dehradun`).

**Check status:**

```bash
curl http://localhost:8000/api/iot/status -H "Authorization: Bearer <your-token>"
```

Returns per-zone connectivity. The frontend's Data Sources page renders
this directly.

**Known limitation**: ingestion authenticates with the same JWT a human
operator uses. Fine for testing or a small pilot; a real sensor rollout
should use per-device API keys (add a `device_tokens` table and a
lighter auth dependency for `app/routers/iot.py`).

**Database note**: SQLite lives at `app/data/floodguard.db` (git-ignored).
On Render's free tier the filesystem is ephemeral, so IoT readings and
any events you add via the API are lost on redeploy/restart (the two
seeded real events are recreated automatically). For persistence, attach
a Render disk or move to hosted Postgres.

## 10. Where to edit things

- **Monitoring locations**: `app/data/zones.py`
- **Basin geometry** (rivers, roads, settlements): `app/data/geography.py`
  — single source of truth the frontend map draws from
- **Model training / synthetic data assumptions**: `app/ml/train_model.py`
- **Model inference / fallback logic**: `app/services/ml_scoring.py`
- **Tier 1 fallback formula**: `app/services/scoring.py`
- **Feature normalization** (shared by both tiers): `app/services/normalize.py`
- **Data sources**: `app/services/open_meteo.py`, `app/services/elevation.py`
  — every external call is wrapped to fail gracefully with a neutral
  fallback rather than crashing the whole response if one upstream call
  times out (this was a real bug we hit and fixed — see git history)

## 11. Known limitations (be upfront about these in your pitch)

- **The model's "accuracy" reflects a synthetic dataset**, not real
  historical flood outcomes — see section 1 and the `train_model.py`
  docstring. This is a real ML pipeline; the ground truth it learned
  from isn't real yet.
- **River level is a discharge proxy**, not an actual gauge height in
  meters. Real river stage data (e.g. India's CWC) should replace this
  for anything beyond a prototype.
- **Slope is a crude 5-point elevation sample**, not a proper DEM-based
  slope raster.
- **Alerts have no persistence** — recomputed live from current risk
  each request, no history across restarts.
- **Auth is single-account and stateless** — fine for a small team, not
  built for public multi-user access.
- **A stale reading still returns a value** — if an upstream API times
  out, the affected signal falls back to a neutral value (and
  `updatedAt` says so) rather than the request failing outright. This
  keeps the dashboard usable but means a "stale" prediction looks like
  a normal one at a glance; check `updatedAt` if that distinction matters
  for your use case.
