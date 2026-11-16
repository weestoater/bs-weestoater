import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Coordinate {
  lat: number;
  lng: number;
}

interface RouteMapProps {
  coordinates?: Coordinate[];
  height?: string;
  title?: string;
}

/**
 * RouteMap Component
 * Displays a Leaflet map with an activity route
 * Adapted from weegym implementation
 */
export function RouteMap({ coordinates = [], height = '400px', title }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [coordinates[0].lat, coordinates[0].lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Create route polyline
    const latLngs = coordinates.map((coord) => [coord.lat, coord.lng] as [number, number]);
    const polyline = L.polyline(latLngs, {
      color: '#fc4c02', // Strava orange
      weight: 4,
      opacity: 0.8,
    }).addTo(map);

    // Add start marker
    L.marker([coordinates[0].lat, coordinates[0].lng], {
      title: 'Start',
    })
      .bindPopup('<b>Start</b>')
      .addTo(map);

    // Add finish marker
    const finish = coordinates[coordinates.length - 1];
    L.marker([finish.lat, finish.lng], {
      title: 'Finish',
    })
      .bindPopup('<b>Finish</b>')
      .addTo(map);

    // Fit map to route bounds
    map.fitBounds(polyline.getBounds(), { padding: [20, 20] });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  if (!coordinates || coordinates.length === 0) {
    return (
      <div className="alert alert-info d-flex align-items-center gap-2">
        <i className="bi bi-info-circle"></i>
        <span>No GPS data available{title ? ` for ${title}` : ''}</span>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width: '100%',
        borderRadius: '0.375rem',
        overflow: 'hidden',
      }}
      className="border"
    />
  );
}
