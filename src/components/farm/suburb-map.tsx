'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Suburb } from '@/lib/types';
import { formatZAR, scoreColor } from '@/lib/utils';
import { MAP_CENTER, MAP_ZOOM, MAP_TILES, MAP_ATTRIBUTION } from '@/lib/constants';
import 'leaflet/dist/leaflet.css';

interface SuburbMapProps {
  suburbs: Suburb[];
  farmedIds: string[];
  onSelectSuburb: (suburb: Suburb) => void;
}

export default function SuburbMap({ suburbs, farmedIds, onSelectSuburb }: SuburbMapProps) {
  return (
    <div className="rounded-card overflow-hidden shadow-card h-[350px] lg:h-auto">
      <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} className="h-full w-full" style={{ minHeight: 350 }} scrollWheelZoom={true} zoomControl={true}>
        <TileLayer url={MAP_TILES} attribution={MAP_ATTRIBUTION} />
        {suburbs.map(sub => (
          <CircleMarker
            key={sub.id}
            center={[sub.lat, sub.lng]}
            radius={Math.max(8, sub.hotLeads * 1.5)}
            pathOptions={{
              color: farmedIds.includes(sub.id) ? scoreColor(sub.score) : '#AEAEB2',
              fillColor: farmedIds.includes(sub.id) ? scoreColor(sub.score) : '#AEAEB2',
              fillOpacity: 0.3,
              weight: 2,
            }}
            eventHandlers={{
              click: () => farmedIds.includes(sub.id) && onSelectSuburb(sub),
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-semibold text-sm">{sub.name}</p>
                <p className="text-xs text-gray-600">Score: {sub.score} · {sub.hotLeads} hot leads</p>
                <p className="text-xs text-gray-600">Avg: {formatZAR(sub.avgPrice)}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
