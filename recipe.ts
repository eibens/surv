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
  serveFileHandler,
  watch,
} from "./mod.ts";

export type SinglePageOptions = {
  docs?: string;
  html: HtmlOptions;
};

export type ServeSinglePageOptions = SinglePageOptions & {
  deploy?: string;
  ws: {
    port: number;
    hostname?: string;
  };
};

export type BuildSinglePageOptions = SinglePageOptions & {};

/**
 * Starts a server for developing a single page application.
 *
 * @param options are the options for the server.
 */
export async function serveSinglePage(options: ServeSinglePageOptions) {
  if (options.deploy) {
    // Start the HTTP server.
    // NOTE: This should be replaced, once process restarting is fixed.
    deployctl(options.deploy)();
  }

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
  const docs = options.docs || "docs";
  watch(docs, broadcast(options.ws));

  // Bundle the main script file and format code
  // when TypeScript files change.
  watch(
    ".",
    rule(
      glob("**/*.ts"),
      debounce(
        bundle("index.ts", "docs/index.js"),
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
  // @ts-ignore This only works in a web-worker or Deno Deploy runtime.
  addEventListener(
    "fetch",
    // @ts-ignore Needs to be ignored too for some reason.
    serveFileHandler({ root: options.root || "docs" }),
  );
}
