from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import init_db
from app.routers import predictions, locations, alerts, geography, auth, model, historical, iot

app = FastAPI(
    title="FloodGuard AI API",
    description="Flash-flood risk prediction backend — a trained ML classifier "
    "(with a weighted-formula fallback) over live rainfall, soil moisture, "
    "river discharge, terrain, and optional IoT sensor data.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    init_db()


app.include_router(auth.router)
app.include_router(predictions.router)
app.include_router(locations.router)
app.include_router(alerts.router)
app.include_router(geography.router)
app.include_router(model.router)
app.include_router(historical.router)
app.include_router(iot.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "FloodGuard AI API"}


@app.get("/health")
async def health():
    return {"status": "operational"}
