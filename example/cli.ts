import * as surv from "../mod.ts";
import { cli } from "../cli.ts";

if (import.meta.main) {
  await cli({
    server: "../serve.ts",
    build: [{
      cmd: ["deno", "run", "-A", "https://deno.land/x/edcb@v0.5.1/cli.ts"],
    }],
    modules: {
      index: "./index.ts",
    },
    pages: {
      index: surv.html({
        title: "surv example",
        modules: ["./index.js"],
      }),
    },
    logger: surv.createLogger({
      name: "surv example",
    }),
  });
}
