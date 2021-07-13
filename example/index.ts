// This triple-slash directive is needed to use the DOM.
/// <reference lib="dom"/>

import { makeWebsite } from "./mod.ts";

// Reload the page whenever a WebSocket message is received.
new WebSocket("ws://localhost:1234")
  .addEventListener("message", () => window.location.reload());

// Generate HTML.
// While `build.ts` is running, changes will trigger a page reload.
document.body.innerHTML = makeWebsite();
