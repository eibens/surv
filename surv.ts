import * as surv from "./dsl.ts";

export type Options = {
  docs: string;
  build: Deno.RunOptions[];
  pages: Record<string, string>;
  wsPort: number;
  wsHostname: string;
  help: string;
  server: string | null;
  modules: Record<string, string>;
};

export async function startServer(options: {
  server: string;
}) {
  await surv.run({
    cmd: [
      "deployctl",
      "run",
      "--no-check",
      "--watch",
      options.server,
    ],
  })();
}

export async function startReloader(options: {
  docs: string;
  wsHostname: string;
  wsPort: number;
}) {
  await Deno.mkdir(options.docs, { recursive: true });
  return surv.watch(
    options.docs,
    surv.broadcast({
      hostname: options.wsHostname,
      port: options.wsPort,
    }),
  );
}

export function startBundler(options: {
  docs: string;
  pages: Record<string, string>;
  modules: Record<string, string>;
}) {
  return surv.watch(
    ".",
    surv.rule(
      surv.glob("**/*.ts"),
      surv.debounce(
        async () => {
          await runModuleBundler(options);
          await runPageBundler(options);
        },
        1000,
      ),
    ),
  );
}

export async function runBuild(options: {
  build: Deno.RunOptions[];
}) {
  // Run post-build checks.
  for (const step of options.build) {
    const status = await Deno.run(step).status();
    if (!status.success) {
      throw new Error(`Step failed: ${step.cmd.join(" ")}`);
    }
  }
}

export async function runPageBundler(options: {
  docs: string;
  pages: Record<string, string>;
}) {
  const keys = Object.keys(options.pages);
  if (keys.length) {
    // Ensure the output dir exists.
    await Deno.mkdir(options.docs, { recursive: true });
  }
  for (const name of keys) {
    verifyFileName(name);
    const htmlFile = surv.join(options.docs, `${name}.html`);
    await Deno.writeTextFile(htmlFile, options.pages[name]);
  }
}

export async function runModuleBundler(options: {
  docs: string;
  modules: Record<string, string>;
}) {
  const keys = Object.keys(options.modules);
  if (keys.length) {
    // Ensure the output dir exists.
    await Deno.mkdir(options.docs, { recursive: true });
  }
  for (const name of keys) {
    verifyFileName(name);
    const tsFile = options.modules[name];
    const jsFile = surv.join(options.docs, `${name}.js`);
    await surv.bundle(tsFile, jsFile)();
  }
}

function verifyFileName(name: string) {
  // Allow only lowercase, alphanumeric string of length 1 to 128.
  // 128 is picked arbitrarily as a generous, but likely safe upper bound.
  // see: https://stackoverflow.com/a/18004165/925580
  if (!name.match(/^[_a-z0-9]{1,128}$/)) {
    throw new Error(`Invalid file name: ${name}`);
  }
}
