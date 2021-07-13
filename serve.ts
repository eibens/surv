import * as surv from "./mod.ts";

// @ts-ignore This only works in a web-worker or Deno Deploy runtime.
addEventListener(
  "fetch",
  // @ts-ignore Needs to be ignored too for some reason.
  surv.serveFileHandler({ root: "docs" }),
);
