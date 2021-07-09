import { start } from "./process.ts";

export function deployctl(mod: string) {
  return start({
    cmd: [
      "deployctl",
      "run",
      "--no-check",
      mod,
    ],
  });
}
