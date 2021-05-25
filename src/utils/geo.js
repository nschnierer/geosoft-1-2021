import { transformToGeoJSONFeature } from "./geo-json";

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

/**
 * @typedef GeoJSON
 * @type {object}
 * @property {string} type
 * @property {object} geometry
 * @property {string} geometry.type
 * @property {[number, number][]} geometry.coordinates `[[longitude, latitude],...]`
 */

/**
 * Cuts the given line string into multiple sections by polygon.
 * @param {GeoJSON} lineString GeoJSON with geometry type LineString
 * @param {GeoJSON} polygon GeoJSON with geometry type Polygon
 * @returns {{ label: string, distance: number, section: GeoJSON }[]}
 */
export const cutLineStringByPolygon = (lineString, polygon) => {
  let prevIsInside;
  let sections = [];
  let section = [];

  console.log(polygon);

  lineString.geometry.coordinates.forEach((lonLat) => {
    const currIsInside = isLonLatInPolygon(
      lonLat,
      polygon.geometry.coordinates
    );

    if (prevIsInside === undefined) {
      // handling the first element
      prevIsInside = currIsInside;
    }

    if (prevIsInside !== currIsInside) {
      // Cutting the section because the current lon/lat
      // is inside or outside of the polygon in comparison of the previous lon/lat.
      sections.push(section);
      section = [];
    }
    section.push(lonLat);
    prevIsInside = currIsInside;
  });

  // pushing the last section
  if (section.length > 0) {
    sections.push(section);
  }

  // Calculate the distance for each section
  // TODO: This logic could be extracted into `utils`, if it's also used some were else.
  const result = sections.map((section, key) => {
    let distance = 0;
    for (let i = 0; i < section.length - 1; i += 1) {
      distance += getDistanceFromLonLatInKm(section[i], section[i + 1]);
    }
    // Adding a label based on the array key
    return {
      label: `${key + 1}`,
      distance,
      section: transformToGeoJSONFeature("LineString", section),
    };
  });

  return result;
};
