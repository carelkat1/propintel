"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { Suburb } from "@/lib/types";


interface SuburbMapProps {
  suburbs: Suburb[];
  farmed: string[];
  onToggle: (name: string) => void;
  onDrill: (name: string) => void;
}

export default function SuburbMap({ suburbs, farmed, onToggle, onDrill }: SuburbMapProps) {
  return (
    <MapContainer
      center={[-26.09, 28.045]}
      zoom={12}
      style={{ width: "100%", height: "100%", borderRadius: 10, minHeight: 400 }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {suburbs.map((s) => {
        const isFarmed = farmed.includes(s.name);
        return (
          <CircleMarker
            key={s.name}
            center={[s.lat, s.lng]}
            radius={isFarmed ? 16 : 8}
            pathOptions={{
              color: isFarmed ? s.color : "#334155",
              fillColor: s.color,
              fillOpacity: isFarmed ? 0.3 : 0.15,
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                if (isFarmed) {
                  onDrill(s.name);
                } else {
                  onToggle(s.name);
                }
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} permanent={isFarmed}>
              <div style={{ background: "#0c1220", color: "#f1f5f9", padding: "4px 8px", borderRadius: 4, border: "1px solid #1e293b", fontSize: 11, fontWeight: 600 }}>
                {s.name} {isFarmed && `(${s.hotLeads} hot)`}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
