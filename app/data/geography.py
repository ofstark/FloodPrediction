"""
Basin geography for the real Uttarakhand river system this deployment
monitors: the Bhagirathi and Alaknanda rivers (each with their own
headwater town), joined by the Mandakini as a tributary at Rudraprayag,
and by each other at Devprayag — the actual, real confluence where the
Ganga is traditionally considered to begin.

River paths are simplified polylines connecting real towns in the
correct real topological order — not surveyed hydrological tracings.
Road paths are illustrative connections along the same valleys, not
GPS-traced highway data.
"""

from pydantic import BaseModel

# Centered roughly on Devprayag, the confluence point.
MAP_CENTER: tuple[float, float] = (30.28, 78.75)

# Bhagirathi: Uttarkashi -> Tehri -> Devprayag (confluence)
BHAGIRATHI_PATH: list[tuple[float, float]] = [
    (30.7268, 78.4354),  # Uttarkashi
    (30.3781, 78.4805),  # New Tehri
    (30.1462, 78.5978),  # Devprayag
]

# Alaknanda: Joshimath -> Chamoli -> Rudraprayag -> Srinagar -> Devprayag
ALAKNANDA_PATH: list[tuple[float, float]] = [
    (30.5553, 79.5655),  # Joshimath
    (30.4041, 79.3200),  # Chamoli
    (30.2843, 78.9811),  # Rudraprayag
    (30.2280, 78.7862),  # Srinagar (Garhwal)
    (30.1462, 78.5978),  # Devprayag
]

# Mandakini: Kedarnath -> Rudraprayag (joins Alaknanda)
MANDAKINI_PATH: list[tuple[float, float]] = [
    (30.7346, 79.0669),  # Kedarnath
    (30.2843, 78.9811),  # Rudraprayag
]

# Ganga proper, downstream of the Devprayag confluence
GANGA_PATH: list[tuple[float, float]] = [
    (30.1462, 78.5978),  # Devprayag
    (30.1089, 78.2676),  # Rishikesh
    (29.9457, 78.1642),  # Haridwar
]

ROAD_PATHS: list[list[tuple[float, float]]] = [
    # Rishikesh-Devprayag-Rudraprayag-Karnaprayag-Joshimath corridor (NH7-ish)
    [
        (30.1089, 78.2676),
        (30.1462, 78.5978),
        (30.2843, 78.9811),
        (30.4041, 79.3200),
        (30.5553, 79.5655),
    ],
    # Rishikesh-Tehri-Uttarkashi corridor
    [
        (30.1089, 78.2676),
        (30.3781, 78.4805),
        (30.7268, 78.4354),
    ],
    # Dehradun-Rishikesh-Haridwar
    [
        (30.3165, 78.0322),
        (30.1089, 78.2676),
        (29.9457, 78.1642),
    ],
    # Rudraprayag-Kedarnath approach road
    [
        (30.2843, 78.9811),
        (30.7346, 79.0669),
    ],
]


class Settlement(BaseModel):
    name: str
    lat: float
    lng: float


# All 11 monitored towns, shown as settlement markers on the map.
SETTLEMENTS: list[Settlement] = [
    Settlement(name="Dehradun", lat=30.3165, lng=78.0322),
    Settlement(name="Rishikesh", lat=30.1089, lng=78.2676),
    Settlement(name="Haridwar", lat=29.9457, lng=78.1642),
    Settlement(name="Devprayag", lat=30.1462, lng=78.5978),
    Settlement(name="Srinagar (Garhwal)", lat=30.2280, lng=78.7862),
    Settlement(name="Rudraprayag", lat=30.2843, lng=78.9811),
    Settlement(name="New Tehri", lat=30.3781, lng=78.4805),
    Settlement(name="Uttarkashi", lat=30.7268, lng=78.4354),
    Settlement(name="Chamoli", lat=30.4041, lng=79.3200),
    Settlement(name="Joshimath", lat=30.5553, lng=79.5655),
    Settlement(name="Kedarnath", lat=30.7346, lng=79.0669),
]
