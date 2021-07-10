// Import the surv DSL.
import {
  broadcast,
  bundle,
  deployctl,
  glob,
  kind,
  renderHtml,
  rule,
  watch,
} from "../mod.ts";

// Ensure the output dir exists.
await Deno.mkdir("docs", { recursive: true });

// Generate the main HTML file once.
await Deno.writeTextFile(
  "docs/index.html",
  renderHtml({
    title: "Surv Website Example",
  }),
);

// Start the HTTP server.
// NOTE: This should be replaced, once process restarting is fixed.
deployctl("serve.js")();

// Restart the HTTP server whenever server.js changes.
// FIXME: Server is restarted before it is closed.
// This leads to address already being in use.
// Ideally, the `start` would ensure the process is terminated
// before restarting the process.
//watch(
//  "serve.js",
//  rule(
//    kind("modify"),
//    deployctl("serve.js"),
//  ),
//);

// Send a message to websocket clients files if `docs` change.
watch(
  "docs",
  broadcast({
    port: 1234,
  }),
);

// Bundle the main script file when TypeScript files change.
watch(
  ".",
  rule(
    glob("**/*.ts"),
    bundle("index.ts", "docs/index.js"),
  ),
);
