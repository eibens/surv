import { run } from "./process.ts";

export function bundle(src: string, out: string) {
  // Create JavaScript bundle.
  return run({
    cmd: [
      "deno",
      "bundle",
      "--no-check", // DOM use causes type errors
      src,
      out,
    ],
  });
}
