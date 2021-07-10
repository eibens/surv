import { serveSinglePage } from "../recipe.ts";

if (import.meta.main) {
  await serveSinglePage({
    // Server script run by deployctl.
    server: "serve.ts",

    // WebSocket server config.
    ws: {
      hostname: "localhost",
      port: 1234,
    },

    // Config for HTML file.
    html: {
      title: "Surv Website Example",
    },
  });
}
