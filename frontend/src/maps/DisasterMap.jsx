import React, { useEffect, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { operationsService } from '../services/operationsService';
import { fetchSosIncidents } from '../redux/features/sos/sosSlice';

const center = [19.0821, 72.8777];

export default function DisasterMap() {
  const dispatch = useDispatch();
  const { incidents } = useSelector((state) => state.sos);
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    dispatch(fetchSosIncidents());
    operationsService.listShelters().then(res => {
      const data = res.data?.data;
      setShelters(Array.isArray(data) ? data : (data?.rows || []));
    }).catch(console.error);
  }, [dispatch]);

  return (
    <MapContainer center={center} zoom={13} className="h-[420px] rounded-lg border border-slate-200 sm:h-[520px] lg:h-[620px]">
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {shelters.map((shelter) => (
        <Marker key={shelter.id} position={[shelter.location?.lat || center[0], shelter.location?.lng || center[1]]}>
          <Popup>
            <strong>{shelter.name}</strong>
            <br />
            Occupancy: {shelter.occupancy}/{shelter.capacity}
          </Popup>
        </Marker>
      ))}

      {incidents.map((incident) => (
        <Circle
          center={[incident.location?.lat || center[0], incident.location?.lng || center[1]]}
          key={incident.id}
          pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.18 }}
          radius={incident.severity === 'critical' ? 900 : 500}
        >
          <Popup>{incident.disasterType} - {incident.status}</Popup>
        </Circle>
      ))}

    </MapContainer>
  );
}
