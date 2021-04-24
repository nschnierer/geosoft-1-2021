import { getDistanceFromLonLatInKm, isLonLatInPolygon } from "./geo";

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
