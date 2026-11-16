/**
 * Polyline Decoder Utility
 * Decodes Google encoded polylines to coordinate arrays
 * Based on: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */

interface DecodedCoordinate {
  lat: number;
  lng: number;
}

/**
 * Decode a Google-encoded polyline string
 * @param encoded - Encoded polyline string
 * @returns Array of {lat, lng} coordinates
 */
export function decodePolyline(encoded: string): DecodedCoordinate[] {
  const coordinates: DecodedCoordinate[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }

  return coordinates;
}

/**
 * Try to extract polyline from article content
 * Looks for polyline data in various formats
 */
export function extractPolylineFromContent(content?: string): string | null {
  if (!content) return null;

  // Look for polyline in data attributes or JSON structures
  // Format 1: data-polyline="..." attribute
  const attrMatch = content.match(/data-polyline="([^"]+)"/);
  if (attrMatch) return attrMatch[1];

  // Format 2: JSON polyline field
  const jsonMatch = content.match(/"polyline"\s*:\s*"([^"]+)"/);
  if (jsonMatch) return jsonMatch[1];

  // Format 3: GPX-style way data (fallback - return null as we need actual polyline)
  return null;
}

/**
 * Generate sample coordinates for demo/testing
 * (Returns a polyline encoded sample)
 */
export function getSamplePolyline(): string {
  // Sample: Simple route around Edinburgh
  return 'yvjiFvyh_EhBaBeHgN_Bj@tDhA~CtDtDzAzEnCtFlAdDfBpEnCjEbAtBrGfJxBzDxAbBzA|AvAvBhAtAx@xBdAhChBvC|CnAbB|@~AlBjCpA|Bz@~BdAvDhBnG|BfIzAnHtAfG';
}
