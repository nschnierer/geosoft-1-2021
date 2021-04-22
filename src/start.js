import "./start.css";

export default class Start {
  constructor() {
    // setup root element
    this.root = document.createElement("div");
    this.root.className += "start";

    // setup button
    this.button = document.createElement("button");
    this.button.innerText = "Add row";
    this.button.className = "btn";
    this.button.addEventListener("click", this.handleClick.bind(this));

    this.rows = [
      { label: "A", distance: 12 },
      { label: "B", distance: 6 },
    ];

    // initial render
    this.render();
    return this.root;
  }

  handleClick() {
    this.rows.push({ label: "A", distance: 12 });
    this.render();
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
            <th>Strecke</th>
            <th>Distanz</th>
          </tr>
        </thead>
        <tbody>
          ${this.rows
            .map(
              (row) => `
          <tr>
            <td>${row.label}</td>
            <td>${row.distance}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <br />
      <div id="button"></div>
    `;
    this.root.querySelector("#button").append(this.button);
  }
}
