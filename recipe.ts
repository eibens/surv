import {
  broadcast,
  bundle,
  debounce,
  deployctl,
  glob,
  html,
  HtmlOptions,
  join,
  rule,
  run,
  sequence,
  serveFileHandler,
  watch,
} from "./mod.ts";

export type ServeSinglePageOptions = {
  dist?: string;
  html: HtmlOptions;
  server: string;
  ws: {
    port: number;
    hostname?: string;
  };
};

/**
 * Starts a server for developing a single page application.
 *
 * @param options are the options for the server.
 */
export async function serveSinglePage(options: ServeSinglePageOptions) {
  const dist = options.dist || "docs";

  // Ensure the output dir exists.
  await Deno.mkdir(dist, { recursive: true });

  // Generate the main HTML file once.
  await Deno.writeTextFile(
    join(dist, "index.html"),
    html(options.html),
  );

  // Start the HTTP server.
  // NOTE: This should be replaced, once process restarting is fixed.
  deployctl(options.server)();

  // Restart the HTTP server whenever server.js changes.
  // FIXME: Server is restarted before it is closed.
  // This leads to address already being in use.
  // Ideally, the `start` would ensure the process is terminated
  // before restarting the process.
  //watch(
  //  options.server,
  //  rule(
  //    kind("modify"),
  //    deployctl(options.server),
  //  ),
  //);

  // Send a message to websocket clients if output files change.
  watch(dist, broadcast(options.ws));

  // Bundle the main script file and format code
  // when TypeScript files change.
  watch(
    ".",
    rule(
      glob("**/*.ts"),
      debounce(
        sequence(
          bundle("index.ts", "docs/index.js"),
          run({ cmd: ["deno", "fmt"] }),
        ),
        1000,
      ),
    ),
  );
}

/**
 * Starts a HTTP file server in a web-worker or Deno Deploy runtime.
 *
 * This function adds a listener for the 'fetch' event to the global object.
 */
export function serveFiles(options: {
  root?: string;
} = {}) {
  addEventListener(
    "fetch",
    // @ts-ignore This only works in a web-worker or Deno Deploy runtime.
    serveFileHandler(options),
  );
}
