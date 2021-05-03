import {
  getDistanceFromLonLatInKm,
  isLonLatInPolygon,
  cutLineStringByPolygon,
} from "./geo";
import { transformToGeoJSONFeature } from "./geo-json";

describe("getDistanceFromLonLatInKm", () => {
  it("should be defined", () => {
    expect(getDistanceFromLonLatInKm).toBeDefined();
  });

  it("should calculate distance correctly", () => {
    // Checked with https://gps-coordinates.org/distance-between-coordinates.php

    const check1 = getDistanceFromLonLatInKm(
      // longitude, latitude
      [7.59851574897766, 51.9650001835794],
      [7.6047492027282715, 51.96575377359425]
    );
    expect(check1).toEqual(0.4352057036010183);

    const check2 = getDistanceFromLonLatInKm(
      // New York
      [-73.935242, 40.73061],
      // Berlin
      [13.404954, 52.520008]
    );
    expect(check2).toEqual(6379.326649175864);
  });
});

describe("isLonLatInPolygon", () => {
  const polygon = [
    // Melle
    [8.340043, 52.197387],
    // Guetersloh
    [8.382627, 51.909344],
    // Detmold
    [8.870979, 51.947336],
    // Bad Oeynhausen
    [8.821147, 52.212934],
  ];

  it("should be defined", () => {
    expect(isLonLatInPolygon).toBeDefined();
  });

  it("should detect lat/lng is inside", () => {
    // basic example:

    const check1 = isLonLatInPolygon(
      [1.5, 1.5],
      [
        [1, 1],
        [1, 2],
        [2, 2],
        [2, 1],
      ]
    );
    expect(check1).toBeTruthy();

    // real world examples:

    const check2 = isLonLatInPolygon(
      // Bielefeld
      [8.551685, 52.01212],
      polygon
    );
    expect(check2).toBeTruthy();

    const check3 = isLonLatInPolygon(
      // Halle (Westfalen)
      [8.551685, 52.01212],
      polygon
    );
    expect(check3).toBeTruthy();

    const check4 = isLonLatInPolygon(
      // Herford
      [8.688866, 52.126245],
      polygon
    );
    expect(check4).toBeTruthy();
  });

  it("should detect lat/lng is not inside polygon", () => {
    const check1 = isLonLatInPolygon(
      // Buende
      [8.583766, 52.206271],
      polygon
    );
    expect(check1).toBeFalsy();

    const check2 = isLonLatInPolygon(
      // Muenster
      [7.634242, 51.970227],
      polygon
    );
    expect(check2).toBeFalsy();

    const check3 = isLonLatInPolygon(
      // Hannover
      [9.797496, 52.379853],
      polygon
    );
    expect(check3).toBeFalsy();
  });
});

describe("cutLineStringByPolygon", () => {
  const polygon = transformToGeoJSONFeature("Polygon", [
    // Melle
    [8.340043, 52.197387],
    // Guetersloh
    [8.382627, 51.909344],
    // Detmold
    [8.870979, 51.947336],
    // Bad Oeynhausen
    [8.821147, 52.212934],
  ]);
  const lineString = transformToGeoJSONFeature("LineString", [
    [7.616054, 51.987763],
    // inside
    [8.508038, 52.113726],
    [8.632177, 52.045937],
    // outside
    [8.075007, 51.841433],
    [8.440139, 51.778049],
    [8.440239, 51.772049],
  ]);

  it("should be defined", () => {
    expect(cutLineStringByPolygon).toBeDefined();
  });

  it("should return 3 route sections", () => {
    // Checked the distance with
    // https://gps-coordinates.org/distance-between-coordinates.php

    const check1 = cutLineStringByPolygon(lineString, polygon);
    expect(check1).toEqual([
      {
        distance: 0,
        label: "1",
        section: transformToGeoJSONFeature("LineString", [
          [7.616054, 51.987763],
        ]),
      },
      {
        distance: 11.348255018643622,
        label: "2",
        section: transformToGeoJSONFeature("LineString", [
          [8.508038, 52.113726],
          [8.632177, 52.045937],
        ]),
      },
      {
        // 26.07 + 0.67 = 26.74 km
        distance: 26.74029760378314,
        label: "3",
        section: transformToGeoJSONFeature("LineString", [
          [8.075007, 51.841433],
          [8.440139, 51.778049],
          [8.440239, 51.772049],
        ]),
      },
    ]);
  });
});
