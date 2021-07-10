new WebSocket("ws://localhost:1234").addEventListener(
  "message",
  () => window.location.reload(),
);
document.body.innerHTML = `\n<h1>Website</h1>\n`;
