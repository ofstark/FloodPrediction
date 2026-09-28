import asyncio
from app.data.zones import Zone
from app.models.schemas import FloodPrediction
from app.services import open_meteo, elevation, ml_scoring, iot


async def build_prediction(zone_id: str, name: str, region: str, lat: float, lng: float) -> FloodPrediction:
    rainfall, soil, river, slope = await asyncio.gather(
        open_meteo.get_rainfall_signal(lat, lng),
        open_meteo.get_soil_moisture_signal(lat, lng),
        open_meteo.get_river_signal(lat, lng),
        elevation.get_slope_signal(lat, lng),
    )

    # Prefer a fresh IoT sensor reading over the public API estimate,
    # per signal, whenever one exists (see app/services/iot.py — falls
    # back to None if no device has reported for this zone recently).
    iot_rainfall = iot.get_recent_reading(zone_id, "rainfall_mm_6h")
    iot_soil = iot.get_recent_reading(zone_id, "soil_moisture_pct")
    iot_discharge = iot.get_recent_reading(zone_id, "river_discharge_m3s")
    iot_discharge_rate = iot.get_recent_reading(zone_id, "river_discharge_rate")

    rainfall_mm = iot_rainfall if iot_rainfall is not None else rainfall["rainfall_6h_mm"]
    soil_pct = iot_soil if iot_soil is not None else soil["soil_moisture_pct"]
    discharge = iot_discharge if iot_discharge is not None else river["discharge_m3s"]
    discharge_rate = (
        iot_discharge_rate if iot_discharge_rate is not None else river["discharge_rate"]
    )
    used_iot = any(
        v is not None for v in [iot_rainfall, iot_soil, iot_discharge, iot_discharge_rate]
    )

    # Tier 2: trained RandomForestClassifier (falls back to the Tier 1
    # weighted formula automatically if the model file isn't present —
    # see app/services/ml_scoring.py).
    result = ml_scoring.compute_risk(
        rainfall_6h_mm=rainfall_mm,
        discharge_m3s=discharge,
        discharge_rate=discharge_rate,
        soil_moisture_pct=soil_pct,
        slope_score=slope["slope_score"],
    )

    any_stale = rainfall.get("stale") or soil.get("stale") or river.get("stale") or slope.get("stale")

    if used_iot:
        updated_label = "just now (IoT sensor)"
    elif any_stale:
        updated_label = "delayed — one or more sources unreachable"
    else:
        updated_label = "just now"

    # riverLevel is expressed in the discharge proxy's native units here.
    # Replace with real gauge height (m) if you wire in a regional river API.
    return FloodPrediction(
        id=zone_id,
        location=name,
        region=region,
        latitude=lat,
        longitude=lng,
        probability=result["probability"],
        risk=result["risk"],
        confidence=result.get("confidence"),
        rainfall=rainfall_mm,
        riverLevel=discharge,
        soilMoisture=soil_pct,
        updatedAt=updated_label,
    )


async def build_prediction_for_zone(zone: Zone) -> FloodPrediction:
    return await build_prediction(zone.id, zone.name, zone.region, zone.lat, zone.lng)


async def build_all_predictions(zones: list[Zone]) -> list[FloodPrediction]:
    return await asyncio.gather(*(build_prediction_for_zone(z) for z in zones))
