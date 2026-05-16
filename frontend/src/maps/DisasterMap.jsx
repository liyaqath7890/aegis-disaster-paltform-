import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { dangerZones, helperMarkers, shelters } from '../constants/demoData';

const center = [19.0821, 72.8777];
const route = [
  [19.076, 72.8777],
  [19.0821, 72.8812],
  [19.0902, 72.8678]
];

export default function DisasterMap() {
  return (
    <MapContainer center={center} zoom={13} className="h-[620px] rounded-lg border border-slate-200">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {shelters.map((shelter) => (
        <Marker key={shelter.id} position={[shelter.location.lat, shelter.location.lng]}>
          <Popup>
            <strong>{shelter.name}</strong>
            <br />
            Occupancy: {shelter.occupancy}/{shelter.capacity}
            <br />
            Food: {shelter.food}
          </Popup>
        </Marker>
      ))}

      {helperMarkers.map((helper) => (
        <CircleMarker center={[helper.lat, helper.lng]} key={helper.id} pathOptions={{ color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.8 }} radius={9}>
          <Popup>
            <strong>{helper.name}</strong>
            <br />
            {helper.status}
          </Popup>
        </CircleMarker>
      ))}

      {dangerZones.map((zone) => (
        <Circle
          center={zone.center}
          key={zone.id}
          pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.18 }}
          radius={zone.radius}
        >
          <Popup>{zone.label}</Popup>
        </Circle>
      ))}

      <Polyline pathOptions={{ color: '#2563eb', dashArray: '8 8', weight: 4 }} positions={route}>
        <Popup>Recommended safe rescue route</Popup>
      </Polyline>
    </MapContainer>
  );
}
