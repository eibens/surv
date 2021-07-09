import { serveFileHandler } from "../mod.ts";

addEventListener(
  "fetch",
  serveFileHandler({
    root: "docs",
  }),
);
