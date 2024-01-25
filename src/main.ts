import "normalize.css";

import "./i18n";

import App from "./App.svelte";
import "./app.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
