const ws = new WebSocket("ws://localhost:1234");
ws.addEventListener("message", () => {
  window.location.reload();
});
const title = window.document.createElement("h1");
title.appendChild(new Text("It works? Test"));
window.document.body.appendChild(title);
const style = document.createElement("style");
document.head.appendChild(style);
style.innerText =
  `\nhtml {\n  background: #222;\n  color: white;\n  font-family: "JetBrains Mono", monospace;\n}\n`;
document.body.innerHTML =
  `\n<h1>This is great</h1>\n<p>So, let's get it on!</p>\n<pre>\nconst double = (x: number) => 2 * x;\n</pre>\n`;
