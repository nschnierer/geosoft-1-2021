import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./tailwind.generated.css";
import "./styles.css";
import { App } from "./App";

const Providers = () => (
  <Router>
    <App />
  </Router>
);

ReactDOM.render(<Providers />, document.getElementById("root"));
