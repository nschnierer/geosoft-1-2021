import { cutLineStringByPolygon } from "./utils/geo";
import { transformToGeoJSONFeature } from "./utils/geo-json";
import * as assets from "./assets";
import "./start.css";

const stringifyEscaped = (object) =>
  JSON.stringify(object).replace(/"/g, '\\"');

/**
 * Handles the html rendering.
 */
export default class Start {
  constructor() {
    // setup root element
    this.root = document.createElement("div");
    this.root.className += "start";

    this.showInitialRoutes();

    return this.root;
  }

  showInitialRoutes() {
    // transform given coordinates to GeoJSON:
    const lineString = transformToGeoJSONFeature("LineString", assets.route);
    const polygon = transformToGeoJSONFeature("LineString", assets.polygon);
    // Calculate rows
    this.rows = cutLineStringByPolygon(lineString, polygon);

    this.render();
  }

  generateFeatureCollection() {
    return {
      type: "FeatureCollection",
      features: this.rows.map(({ section }) => section),
    };
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

    const featureCollection = this.generateFeatureCollection();

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
            <th>GeoJSON</th>
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
                row.section.geometry.type
              } &nbsp;<button class="btn-subtle" onclick='navigator.clipboard.writeText("${stringifyEscaped(
                row.section
              )}");'>Copy</button>
            </td>
          </tr>`
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>${distanceTotal.toFixed(3)}</td>
            <td>FeatureCollection&nbsp; <button class="btn-subtle" onclick='navigator.clipboard.writeText("${stringifyEscaped(
              featureCollection
            )}")'>Copy</button></td>
          </tr>
        </tfoot>
      </table>
      <br />
      <div id="button"></div>
    `;
  }
}
