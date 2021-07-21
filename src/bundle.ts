import { run } from "./process.ts";

export function bundle(src: string, out: string, options: {
  tsconfig?: string;
} = {}) {
  // Create JavaScript bundle.
  return run({
    cmd: [
      "deno",
      "bundle",
      "--no-check", // DOM use causes type errors
      ...(options.tsconfig ? ["--config=" + options.tsconfig] : []),
      src,
      out,
    ],
  });
}
