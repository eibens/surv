import { broadcast, bundle, glob, renderHtml, rule, watch } from "../mod.ts";

await Deno.mkdir("docs", { recursive: true });

await Deno.writeTextFile(
  "docs/index.html",
  renderHtml({
    title: "Surv Website Example",
  }),
);

watch(
  "docs",
  broadcast({
    port: 1234,
  }),
);

watch(
  ".",
  rule(
    glob("**/*.ts"),
    bundle("index.ts", "docs/index.js"),
  ),
);
