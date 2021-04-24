import Start, { cutRouteByPolygon } from "./start";

describe("Start", () => {
  it("should be defined", () => {
    expect(Start).toBeDefined();
  });
});

describe("cutRouteByPolygon", () => {
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
  const route = [
    [7.616054, 51.987763],
    // inside
    [8.508038, 52.113726],
    [8.632177, 52.045937],
    // outside
    [8.075007, 51.841433],
    [8.440139, 51.778049],
    [8.440239, 51.772049],
  ];

  it("should be defined", () => {
    expect(cutRouteByPolygon).toBeDefined();
  });

  it("should return 3 route sections", () => {
    // Checked the distance with
    // https://gps-coordinates.org/distance-between-coordinates.php

    const check1 = cutRouteByPolygon(route, polygon);
    expect(check1).toEqual([
      { distance: 0, label: "1", section: [[7.616054, 51.987763]] },
      {
        distance: 11.348255018643622,
        label: "2",
        section: [
          [8.508038, 52.113726],
          [8.632177, 52.045937],
        ],
      },
      {
        // 26.07 + 0.67 = 26.74 km
        distance: 26.74029760378314,
        label: "3",
        section: [
          [8.075007, 51.841433],
          [8.440139, 51.778049],
          [8.440239, 51.772049],
        ],
      },
    ]);
  });
});
