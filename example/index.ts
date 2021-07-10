// This triple-slash directive is needed to use the DOM.
/// <reference lib="dom"/>

// Reload the page whenever a WebSocket message is received.
const ws = new WebSocket("ws://localhost:1234");
ws.addEventListener("message", () => {
  window.location.reload();
});

// Generate HTML.
// While `build.ts` is running, changes will trigger a page reload.
document.body.innerHTML = `
<h1>Website</h1>
`;
