/**
 * Utility functions for POI data transformations and formatting
 */

/**
 * Format latitude and longitude coordinates into a human-readable GPS string.
 * Example: 10.7720° N, 106.6983° E
 */
export function formatCoordinates(lat: number, lng: number): string {
  let latDirection = "N";
  if (lat < 0) {
    latDirection = "S";
  }

  let lngDirection = "E";
  if (lng < 0) {
    lngDirection = "W";
  }

  const latText = `${Math.abs(lat).toFixed(4)}° ${latDirection}`;
  const lngText = `${Math.abs(lng).toFixed(4)}° ${lngDirection}`;

  return `${latText}, ${lngText}`;
}
