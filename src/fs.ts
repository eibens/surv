import { globToRegExp } from "https://deno.land/std@0.100.0/path/glob.ts";

type Kind = Deno.FsEvent["kind"];

/**
 * Starts a file watcher that runs in the background.
 *
 * @param paths are the paths that should be watched.
 * @param handle is the function that handles file system events.
 * @returns an object for interacting with the watcher.
 */
export function watch(
  paths: string | string[],
  handle: (event: Deno.FsEvent) => void | Promise<void>,
): Deno.Closer {
  handle({
    kind: "any",
    paths: [],
  });

  const watcher = Deno.watchFs(paths, {
    recursive: true,
  });

  (async () => {
    for await (const event of watcher) {
      console.log(`${event.kind}: ${event.paths.join(", ")}`);
      await handle(event);
    }
  })();

  return {
    close: () => {
      watcher?.close();
      return Promise.resolve();
    },
  };
}

export function kind(kind: Kind) {
  return (event: Deno.FsEvent) => {
    return event.kind === "any" || event.kind === kind;
  };
}

export function file(match: string | RegExp) {
  return (event: Deno.FsEvent) => {
    if (typeof match === "string") {
      return event.paths.includes(match);
    }
    return event.paths.map((path) => path.match(match) != null)
      .reduce((a, b) => a || b, false);
  };
}

export function glob(pattern: string) {
  return file(globToRegExp(pattern));
}
