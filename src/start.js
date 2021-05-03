import { cutLineStringByPolygon } from "./utils/geo";
import { isGeoJSONFeature, transformToGeoJSONFeature } from "./utils/geo-json";
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

    // add buttons in constructor to use event listener
    this.calculateButton = document.createElement("button");
    this.calculateButton.type = "button";
    this.calculateButton.className = "btn-primary";
    this.calculateButton.textContent = "Calculate";
    this.calculateButton.addEventListener(
      "click",
      this.addCustomLineString.bind(this)
    );

    this.resetButton = document.createElement("button");
    this.resetButton.type = "button";
    this.resetButton.className = "btn-subtle";
    this.resetButton.textContent = "Reset";
    this.resetButton.addEventListener("click", this.resetLineString.bind(this));

    // load default LineString and Polygon
    this.lineString = transformToGeoJSONFeature("LineString", assets.route);
    this.polygon = transformToGeoJSONFeature("Polygon", assets.polygon);

    this.calculateRows();

    return this.root;
  }

  addCustomLineString() {
    let lineString = "";
    try {
      lineString = JSON.parse(this.root.querySelector("#geoJSON").value);
    } catch (err) {
      console.error(err);
      alert("Invalid JSON!");
      return;
    }

    if (!isGeoJSONFeature(lineString)) {
      alert("Invalid GeoJSON!");
      return;
    }

    if (lineString.geometry.type !== "LineString") {
      alert("Please add a LineString geometry!");
      return;
    }

    this.lineString = lineString;
    this.calculateRows();
  }

  resetLineString() {
    this.lineString = transformToGeoJSONFeature("LineString", assets.route);
    this.calculateRows();
  }

  calculateRows() {
    this.rows = cutLineStringByPolygon(this.lineString, this.polygon);
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
      <div>
        <textarea class="textarea" id="geoJSON">${JSON.stringify(
          this.lineString,
          null,
          // format JSON
          2
        )}</textarea>
      </div>
      <br />
      <div style="text-align: right;">
        <span id="reset"></span>
        <span id="addCustomLineString"></span>
      </div>
      <br />
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
            <td>
              FeatureCollection&nbsp;
              <button
                class="btn-subtle"
                onclick='navigator.clipboard.writeText("${stringifyEscaped(
                  featureCollection
                )}")'
              >
                Copy
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <br />
      <div id="button"></div>
    `;

    this.root
      .querySelector("#addCustomLineString")
      .append(this.calculateButton);
    this.root.querySelector("#reset").append(this.resetButton);
  }
}
