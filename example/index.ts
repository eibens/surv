/// <reference lib="dom"/>

const ws = new WebSocket("ws://localhost:1234");
ws.addEventListener("message", () => {
  window.location.reload();
});

document.body.innerHTML = `
<h1>Website</h1>
`;
