/**
 * @param {string} type The geometry type: `LineString`, `Polygon`
 * @param {[number, number][]} coordinates `[[longitude, latitude],...]`
 */
export const transformToGeoJSONFeature = (type, coordinates) => ({
  type: "Feature",
  geometry: {
    type: type,
    coordinates,
  },
});

/**
 * Check if the given object is a GeoJSON feature.
 * IMPORTANT: Only supports `LineString` and `Polygon`
 * @param {object} geoJSON
 */
export const isGeoJSONFeature = (geoJSON) => {
  const { type, properties, geometry } = geoJSON;
  if (type !== "Feature") {
    return false;
  }
  if (properties && typeof properties !== "object") {
    return false;
  }
  if (!geometry) {
    return false;
  }
  if (
    typeof geometry.type !== "string" ||
    !["LineString", "Polygon"].includes(geometry.type)
  ) {
    return false;
  }
  if (!geometry.coordinates || !Array.isArray(geometry.coordinates)) {
    return false;
  }
  if (
    geometry.coordinates.length > 0 &&
    (typeof geometry.coordinates[0][0] !== "number" ||
      typeof geometry.coordinates[0][0] !== "number")
  ) {
    return false;
  }
  return true;
};
