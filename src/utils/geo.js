/**
 * Converts from degrees to radians.
 * @param {number} deg
 * @returns {number}
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get distance in metre between two lat and long coordinate pairs.
 * Source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * @param {[number, number]} c1 `[longitude, latitude]`
 * @param {[number, number]} c2 `[longitude, latitude]`
 * @returns {number}
 */
export function getDistanceFromLonLatInKm([lon1, lat1], [lon2, lat2]) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

/**
 * Checks if a point is in a given rect.
 * Source: https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon
 * @param {[number, number]} point `[longitude, latitude]`
 * @param {[number, number][]} polygon `[[longitude, latitude], ...]`
 * @returns {boolean}
 */
export function isLonLatInPolygon([lng, lat], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > lat != yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}
