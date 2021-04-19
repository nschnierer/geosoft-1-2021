(() => {
  // src/start.js
  var Start = class {
    constructor() {
      this.root = document.createElement("div");
      this.root.className += "start";
      this.button = document.createElement("button");
      this.button.innerText = "Add row";
      this.button.addEventListener("click", this.handleClick.bind(this));
      this.rows = [];
      this.render();
      return this.root;
    }
    handleClick() {
      this.rows.push({label: "A", distance: 12});
      this.render();
    }
    render() {
      this.root.innerHTML = `
      <h1>Table Example</h1>
      <br />
      <table>
        <tr>
          <th>Strecke</th>
          <th>Distanz</th>
          ${this.rows.map((row) => `
            <tr>
              <td>${row.label}</td>
              <td>${row.distance}</td>
            </tr>`).join("")}
        </tr>
      </table>
      <div id="button"></div>
    `;
      this.root.querySelector("#button").append(this.button);
    }
  };
  var start_default = Start;

  // src/index.js
  var start = new start_default();
  document.getElementById("app").append(start);
})();
//# sourceMappingURL=bundle.js.map
