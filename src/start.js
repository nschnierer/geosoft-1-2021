import { getDistanceFromLonLatInKm, isLonLatInPolygon } from "./utils/geo";
import * as assets from "./assets";
import "./start.css";

/**
 * Cuts the given route into multiple sections by polygon.
 * @param {[number, number][]} route `[[longitude, latitude],...]`
 * @param {[number, number][]} polygon `[[longitude, latitude],...]`
 * @returns {{ label: string, distance: number, section: [number, number][] }[]}
 */
export const cutRouteByPolygon = (route, polygon) => {
  let prevIsInside;
  let sections = [];
  let section = [];

  route.forEach((lonLat) => {
    const currIsInside = isLonLatInPolygon(lonLat, polygon);

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
    return { label: `${key + 1}`, distance, section };
  });

  return result;
};

/**
 * Handles the html rendering.
 */
export default class Start {
  constructor() {
    // setup root element
    this.root = document.createElement("div");
    this.root.className += "start";

    // calculate route sections
    this.rows = cutRouteByPolygon(assets.route, assets.polygon);

    // initial render
    this.render();
    return this.root;
  }

  render() {
    // sort by distance desc
    const rowsSorted = this.rows.sort((a, b) => b.distance - a.distance);
    // calculate total values with reduce
    // See how reduce works:
    // https://www.digitalocean.com/community/tutorials/js-finally-understand-reduce
    const distanceTotal = this.rows.reduce(
      (acc, curr) => acc + curr.distance,
      0
    );
    const wayPointsTotal = this.rows.reduce(
      (acc, curr) => acc + curr.section.length,
      0
    );

    // Using template literals to render the whole document (inspired by React).
    // Maybe this approach may result into performance issues.
    // However in that case it doesn't matter.
    this.root.innerHTML = `
      <h1>Geosoftware I SS 2021</h1>
      <br />
      <table>
        <thead>
          <tr>
            <th>Section</th>
            <th>Distance (km)</th>
            <th>Way points</th>
          </tr>
        </thead>
        <tbody>
          ${rowsSorted
            .map(
              (row) => `
          <tr>
            <td width="30%">${row.label}</td>
            <td width="40%">${row.distance.toFixed(3)}</td>
            <td width="30%">
              ${
                row.section.length
              } &nbsp;<button class="btn-subtle" onclick="navigator.clipboard.writeText('${JSON.stringify(
                row.section
              )}');">Copy</button>
            </td>
          </tr>`
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>${distanceTotal.toFixed(3)}</td>
            <td>${wayPointsTotal}</td>
          </tr>
        </tfoot>
      </table>
      <br />
      <div id="button"></div>
    `;
  }
}
