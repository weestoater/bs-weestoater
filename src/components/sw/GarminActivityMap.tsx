import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GPSData } from "../../interfaces/GarminActivity";
import polyline from "polyline-encoded";

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error -- Leaflet default icon URL method must be removed before merging custom icon options
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GarminActivityMapProps {
  gpsData: GPSData;
  height?: string;
  activityType?: string;
}

/**
 * Map component to display GPS route for a Garmin activity
 */
export const GarminActivityMap = ({
  gpsData,
  height = "300px",
  activityType = "other",
}: GarminActivityMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !gpsData) return;

    // Initialize map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Get route color based on activity type
    const getRouteColor = (type: string) => {
      const colors: Record<string, string> = {
        running: "#e74c3c",
        cycling: "#3498db",
        walking: "#2ecc71",
        swimming: "#9b59b6",
        other: "#95a5a6",
      };
      return colors[type] || colors.other;
    };

    const routeColor = getRouteColor(activityType);

    // Decode and display polyline if available
    if (gpsData.polyline) {
      try {
        const decodedCoordinates = polyline.decode(gpsData.polyline);
        const latLngs: L.LatLngExpression[] = decodedCoordinates.map(
          (coord: number[]) => [coord[0], coord[1]] as L.LatLngExpression,
        );

        if (latLngs.length > 0) {
          // Draw route polyline
          const route = L.polyline(latLngs, {
            color: routeColor,
            weight: 4,
            opacity: 0.7,
          }).addTo(map);

          // Fit map to route bounds
          map.fitBounds(route.getBounds(), { padding: [20, 20] });

          // Add start marker
          if (latLngs[0]) {
            L.marker(latLngs[0])
              .addTo(map)
              .bindPopup("<strong>Start</strong>")
              .openPopup();
          }

          // Add end marker if different from start
          if (latLngs.length > 1 && latLngs[latLngs.length - 1]) {
            L.marker(latLngs[latLngs.length - 1])
              .addTo(map)
              .bindPopup("<strong>End</strong>");
          }

          return;
        }
      } catch (error) {
        console.error("Error decoding polyline:", error);
      }
    }

    // Fallback: show start and end points if polyline not available
    if (gpsData.startPoint) {
      const startLatLng: L.LatLngExpression = [
        gpsData.startPoint.lat,
        gpsData.startPoint.lng,
      ];

      L.marker(startLatLng)
        .addTo(map)
        .bindPopup("<strong>Start</strong>")
        .openPopup();

      if (gpsData.endPoint) {
        const endLatLng: L.LatLngExpression = [
          gpsData.endPoint.lat,
          gpsData.endPoint.lng,
        ];

        L.marker(endLatLng).addTo(map).bindPopup("<strong>End</strong>");

        // Draw a line between start and end
        L.polyline([startLatLng, endLatLng], {
          color: routeColor,
          weight: 3,
          opacity: 0.5,
          dashArray: "10, 10",
        }).addTo(map);

        // Fit bounds to include both markers
        map.fitBounds([startLatLng, endLatLng], { padding: [50, 50] });
      } else {
        // Only start point, center on it
        map.setView(startLatLng, 14);
      }
    }
  }, [gpsData, activityType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (!gpsData) {
    return null;
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: height,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
      className="garmin-activity-map"
      role="img"
      aria-label="Activity route map"
    />
  );
};
