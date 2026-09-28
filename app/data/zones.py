"""
Monitored locations — real towns along the Ganga headwaters river system
in Uttarakhand, India (Bhagirathi, Alaknanda, and Mandakini valleys,
converging into the Ganga at Devprayag).

This region was chosen deliberately, not just because the original
placeholder coordinates happened to land here: it's a genuine flash-flood
risk corridor — Kedarnath (2013) and Chamoli (2021) are real, well-known
disaster sites in this exact river system.

Coordinates are approximate town-center locations, not surveyed GPS
points — accurate enough for regional risk monitoring, not for anything
requiring survey-grade precision.
"""

from pydantic import BaseModel


class Zone(BaseModel):
    id: str
    name: str
    region: str
    lat: float
    lng: float


ZONES: list[Zone] = [
    Zone(id="dehradun", name="Dehradun", region="Doon Valley", lat=30.3165, lng=78.0322),
    Zone(id="rishikesh", name="Rishikesh", region="Ganga Plains", lat=30.1089, lng=78.2676),
    Zone(id="haridwar", name="Haridwar", region="Ganga Plains", lat=29.9457, lng=78.1642),
    Zone(id="devprayag", name="Devprayag", region="Ganga Origin Confluence", lat=30.1462, lng=78.5978),
    Zone(id="srinagar-garhwal", name="Srinagar (Garhwal)", region="Alaknanda Valley", lat=30.2280, lng=78.7862),
    Zone(id="rudraprayag", name="Rudraprayag", region="Alaknanda-Mandakini Confluence", lat=30.2843, lng=78.9811),
    Zone(id="tehri", name="New Tehri", region="Bhagirathi Valley", lat=30.3781, lng=78.4805),
    Zone(id="uttarkashi", name="Uttarkashi", region="Bhagirathi Valley", lat=30.7268, lng=78.4354),
    Zone(id="chamoli", name="Chamoli", region="Alaknanda Valley", lat=30.4041, lng=79.3200),
    Zone(id="joshimath", name="Joshimath", region="Upper Alaknanda Valley", lat=30.5553, lng=79.5655),
    Zone(id="kedarnath", name="Kedarnath", region="Mandakini Valley", lat=30.7346, lng=79.0669),
]


def get_zone(zone_id: str) -> Zone | None:
    return next((z for z in ZONES if z.id == zone_id), None)
