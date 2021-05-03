import { transformToGeoJSONFeature, isGeoJSONFeature } from "./geo-json";

describe("transformToGeoJSONFeature", () => {
  it("should be defined", () => {
    expect(transformToGeoJSONFeature).toBeDefined();
  });

  it("should transform", () => {
    expect(
      transformToGeoJSONFeature("LineString", [
        [7.616054, 51.987763],
        [8.508038, 52.113726],
      ])
    ).toEqual({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [7.616054, 51.987763],
          [8.508038, 52.113726],
        ],
      },
    });
  });
});

describe("isGeoJSONFeature", () => {
  it("should check successfully", () => {
    expect(
      isGeoJSONFeature({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [20, 10],
            [20, 10],
          ],
        },
        properties: {
          name: "fortune island",
        },
      })
    ).toBeTruthy();

    expect(
      isGeoJSONFeature({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [20.5, 10],
            [20, 10.5],
            [20, 10],
            [2.5, 1.5],
            [20, 10],
          ],
        },
      })
    ).toBeTruthy();
  });

  it("should detect wrong GeoJSON", () => {
    // missing type
    expect(
      isGeoJSONFeature({
        geometry: {
          type: "LineString",
          coordinates: [
            [20, 10],
            [20, 10],
          ],
        },
        properties: {
          name: "fortune island",
        },
      })
    ).toBeFalsy();

    // wrong coordinates
    expect(
      isGeoJSONFeature({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: ["string"],
        },
      })
    ).toBeFalsy();

    // missing geometry
    expect(
      isGeoJSONFeature({
        type: "Feature",
      })
    ).toBeFalsy();

    // wrong geometry type type
    expect(
      isGeoJSONFeature({
        type: "Feature",
        geometry: {
          type: "Wrong",
          coordinates: [],
        },
      })
    ).toBeFalsy();
  });
});
