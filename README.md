# FloodGuard AI — Frontend

AI-powered flash-flood prediction & early-warning command center for the
Ganga headwaters river system in Uttarakhand, India — 11 real monitored
towns across the Bhagirathi, Alaknanda, and Mandakini valleys.

**This is the frontend.** It's built to run against the companion FastAPI
backend (`floodguard-backend/`), which now runs a trained ML classifier
(Tier 2) instead of a hand-set formula. A mock-data fallback still exists
in `src/data/` for offline development.

---

## 1. Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React-Leaflet (GIS map — Streets/Terrain/Satellite/Dark basemaps, live risk zones)
- Recharts (charts)
- Framer Motion (animation)
- Lucide React (icons)

## 2. Installation

```bash
npm install
```

## 3. Point it at the backend

Create `.env` in this folder:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Make sure the backend is running first (see `floodguard-backend/README.md`).

**Auth is enabled.** Every dashboard route is wrapped in `ProtectedRoute`
(`src/App.tsx`) and the backend requires a JWT on all data routes. Sign in
as `Astra` with the password you set on the backend.

## 4. Running the app

```bash
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## 5. Project Structure

```
src/
├── components/
│   ├── layout/         Sidebar, Topbar, PageContainer
│   ├── dashboard/       RiskCard, PredictionPanel, EnvironmentalCharts,
│   │                    AlertFeed, WarningCard
│   ├── map/             RiskMap, MapLegend, LocationPopup
│   ├── auth/            ProtectedRoute
│   └── common/          GlassCard, Badge, StatusIndicator, LoadingScreen
├── pages/                Landing, Login, Dashboard, RiskMapPage, Predictions,
│                         Alerts, Historical, DataSources, SystemStatus, Settings
├── context/              AuthContext — session state, login/logout
├── data/                 Mock fallback data (used only if USE_MOCK_DATA is true)
├── services/             api.ts, auth.ts, predictions.ts, alerts.ts,
│                         locations.ts, geography.ts, model.ts
├── types/                Shared TypeScript interfaces
├── lib/                  risk.ts (risk color helpers), cn.ts (classnames util)
├── App.tsx               Routes
├── main.tsx              App entry point
└── index.css             Tailwind + global + Leaflet control styling
```

## 6. Monitored locations

Real towns along the Ganga headwaters in Uttarakhand — Dehradun,
Rishikesh, Haridwar, Devprayag, Srinagar (Garhwal), Rudraprayag, New
Tehri, Uttarkashi, Chamoli, Joshimath, and Kedarnath. This is a genuine
flash-flood risk corridor: Kedarnath (2013) and Chamoli (2021) are real,
well-documented disaster sites in this exact river system — see the
Historical Events page, which clearly distinguishes those two real
events from illustrative placeholder entries.

## 7. The ML model, shown in the UI

- **Prediction Panel** (Dashboard) shows both the flood **probability**
  (the risk ring) and the model's **confidence** — these are different
  things. Probability is P(flood); confidence is how sure the model is
  of *whichever* class it picked, so a model can be 95% confident risk
  is LOW.
- **Predictions table** has a Confidence column alongside Probability.
- **System Status** page fetches `/api/model/metrics` live and shows
  real accuracy/precision/recall/F1/ROC-AUC plus feature importances
  from the last training run.
- All of this reflects a **real, trained RandomForestClassifier** — see
  the backend README for the honest caveat about what the training data
  is (synthetic, domain-informed) and isn't (real historical flood
  records).

## 8. The map

Default basemap is now **Streets** (standard OpenStreetMap tiles) so it
reads immediately as a real, labeled map — switch to Terrain, Satellite,
or Dark via the layer control (bottom-left). River paths show the real
Bhagirathi/Alaknanda/Mandakini/Ganga system converging at their actual
real confluence points.

## 9. Mock data vs. live data

`src/services/api.ts` has:

```ts
export const USE_MOCK_DATA = false;
```

With this `false` (the default), every page calls the real backend. Flip
it to `true` to fall back to the static mock data in `src/data/` — it
mirrors the backend's 11 real zones, geometry, and includes plausible
confidence values so the UI looks the same either way.

### API endpoints in use

```
POST /api/auth/login      → { access_token, username }
GET  /api/auth/me         → current username
GET  /api/predictions     → FloodPrediction[] (includes confidence)
GET  /api/alerts          → AlertItem[]
GET  /api/locations       → MonitoringZone[] (includes confidence)
GET  /api/risk-map        → MonitoringZone[]
GET  /api/geography       → GeographyData (river paths, roads, settlements)
GET  /api/model/metrics   → ModelMetrics (accuracy, precision, recall, F1, ROC-AUC, feature importances)
GET  /api/historical/events → HistoricalEvent[] (real + illustrative, SQLite-backed)
GET  /api/iot/status      → IoTZoneStatus[] (which towns have a live sensor feed)
POST /api/predict         → FloodPrediction (on-demand, arbitrary lat/lon)
```

## 10. Honest limitations (worth knowing before presenting this)

- **The model's "accuracy" is measured on a synthetic, domain-informed
  training dataset**, not real historical flood records — this is a
  real, working ML pipeline; what's synthetic is the ground truth it
  learned from. See the backend's `app/ml/train_model.py` docstring.
- **River level is a discharge proxy**, not a real gauge height in meters.
- The **environmental trend charts** (rainfall/river/soil over 24h) are
  generated client-side to show the expected shape of each signal — the
  backend doesn't yet persist a time-series history of readings.
- **Alerts have no persistence** across backend restarts.
- **No physical IoT sensors are installed** — the Data Sources page shows
  every town as "No sensor" until a device actually pushes readings to
  `/api/iot/readings` (see the backend README, section 9).
- **Historical events are seeded with two real, documented disasters**
  (Kedarnath 2013, Chamoli 2021) plus illustrative placeholders. Add real
  records via `POST /api/historical/events`.
- **Auth is single-account** — fine for a small team, not built for
  public multi-user access.
