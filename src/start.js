import { getDistanceFromLonLatInKm, isLonLatInPolygon } from "./uitls/geo";
import * as assets from "./assets";
import "./start.css";

// WIP
const calcStuff = (route, polygon) => {
  let lastIsInside;
  let sections = [];
  let section = [];

  route.forEach((lonLat) => {
    currIsInside = isLonLatInPolygon(lonLat, polygon);

    if (lastIsInside === undefined) {
      lastIsInside = currIsInside;
    }

    if (lastIsInside !== currIsInside) {
      sections.push(section);
      section = [];
    }
    section.push(lonLat);
    lastIsInside = currIsInside;
  });

  sections.push(section);

  const result = sections.map((section, key) => {
    let distance = 0;
    for (let i = 1; i < section.length - 1; i += 1) {
      distance += getDistanceFromLonLatInKm(section[i - 1], section[i]);
    }
    return { label: `${key + 1}`, distance, section };
  });

  return result;
};

export default class Start {
  constructor() {
    // setup root element
    this.root = document.createElement("div");
    this.root.className += "start";

    this.rows = calcStuff(assets.route, assets.polygon);

    // initial render
    this.render();
    return this.root;
  }

  render() {
    // Using template literals to render the whole document (inspired by React).
    // Maybe this approach may result into performance issues.
    // However in that case it doesn't matter.
    this.root.innerHTML = `
      <h1>Table Example</h1>
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
          ${this.rows
            .map(
              (row) => `
          <tr>
            <td width="30%">${row.label}</td>
            <td width="40%">${row.distance.toFixed(3)}</td>
            <td width="30%">${row.section.length}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <br />
      <div id="button"></div>
    `;
  }
}
