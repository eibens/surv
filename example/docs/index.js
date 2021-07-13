function makeWebsite() {
  return `<h1>Lambda's new website!</h1>`;
}
new WebSocket("ws://localhost:1234").addEventListener(
  "message",
  () => window.location.reload(),
);
document.body.innerHTML = makeWebsite();
