import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  ScaleControl,
  Circle,
  Polyline,
  Popup,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { MonitoringZone, GeographyData } from "@/types";
import { MAP_CENTER as FALLBACK_CENTER } from "@/data/mapData";
import { riskColorMap } from "@/lib/risk";
import LocationPopup from "./LocationPopup";

interface RiskMapProps {
  zones: MonitoringZone[];
  geography?: GeographyData | null;
  activeLayers?: {
    riskZones?: boolean;
    rivers?: boolean;
    roads?: boolean;
    settlements?: boolean;
    monitoringStations?: boolean;
  };
  onSelectZone?: (zone: MonitoringZone) => void;
  flyToZone?: MonitoringZone | null;
  className?: string;
}

const defaultLayers = {
  riskZones: true,
  rivers: true,
  roads: true,
  settlements: true,
  monitoringStations: true,
};

function FlyToZone({ zone }: { zone: MonitoringZone | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (zone) {
      map.flyTo([zone.lat, zone.lng], 13, { duration: 0.9 });
    }
  }, [zone, map]);
  return null;
}

export default function RiskMap({
  zones,
  geography,
  activeLayers = defaultLayers,
  onSelectZone,
  flyToZone,
  className,
}: RiskMapProps) {
  const layers = { ...defaultLayers, ...activeLayers };
  const center = geography?.mapCenter ?? FALLBACK_CENTER;
  const riverPaths = geography?.riverPaths ?? [];
  const roadPaths = geography?.roadPaths ?? [];
  const settlements = geography?.settlements ?? [];

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#e5e3df" }}
        className="rounded-2xl"
      >
        <FlyToZone zone={flyToZone} />
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Streets">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomright" imperial={false} />

        {layers.rivers &&
          riverPaths.map((path, i) => (
            <Polyline
              key={`river-${i}`}
              positions={path}
              pathOptions={{ color: "#3b82f6", weight: i === 0 ? 4 : 2.5, opacity: 0.85 }}
            />
          ))}

        {layers.roads &&
          roadPaths.map((path, i) => (
            <Polyline
              key={`road-${i}`}
              positions={path}
              pathOptions={{ color: "#475569", weight: 1.5, opacity: 0.6, dashArray: "5 5" }}
            />
          ))}

        {layers.settlements &&
          settlements.map((s) => (
            <CircleMarker
              key={s.name}
              center={[s.lat, s.lng]}
              radius={4}
              pathOptions={{ color: "#ffffff", fillColor: "#1e3a5f", fillOpacity: 0.9, weight: 1.5 }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                {s.name}
              </Tooltip>
            </CircleMarker>
          ))}

        {layers.riskZones &&
          zones.map((zone) => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: riskColorMap[zone.risk],
                fillColor: riskColorMap[zone.risk],
                fillOpacity: 0.16,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onSelectZone?.(zone),
              }}
            >
              <Popup>
                <LocationPopup zone={zone} />
              </Popup>
            </Circle>
          ))}

        {layers.monitoringStations &&
          zones.map((zone) => (
            <CircleMarker
              key={`station-${zone.id}`}
              center={[zone.lat, zone.lng]}
              radius={6}
              pathOptions={{
                color: "#ffffff",
                fillColor: riskColorMap[zone.risk],
                fillOpacity: 1,
                weight: 2,
              }}
              eventHandlers={{ click: () => onSelectZone?.(zone) }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                {zone.name} · {zone.risk}
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}
