import { join, normalize } from "https://deno.land/std@0.99.0/path/mod.ts";
import {
  contentType,
  lookup,
} from "https://deno.land/x/media_types@v2.9.1/mod.ts";

export type ServeFileOptions = {
  root?: string;
};

export function serveFileHandler(options: ServeFileOptions = {}) {
  return async (event: {
    respondWith: (response: Response) => Promise<void>;
    request: {
      url: string;
    };
  }) => {
    await event.respondWith(
      await serveFile(event.request.url, options),
    );
  };
}

export async function serveFile(
  url: string,
  options: ServeFileOptions,
): Promise<Response> {
  const { pathname } = new URL(url);

  const root = normalize(options.root || ".");
  let file = normalize(join(root, pathname));
  let fileInfo: Deno.FileInfo;
  try {
    fileInfo = await Deno.stat(file);
    if (fileInfo.isDirectory) {
      file = join(file, "index.html");
      fileInfo = await Deno.stat(file);
    }
  } catch (error) {
    console.log(error.message + "[file]: " + file);
    return new Response(`404 - file not found:\n${file}`, {
      status: 404,
      statusText: "file not found",
    });
  }

  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());

  const mime = lookup(file);
  if (mime) {
    const contentTypeValue = contentType(mime);
    if (contentTypeValue) {
      headers.set("content-type", contentTypeValue);
    }
  }

  const data = await Deno.readFile(file);
  return new Response(data, {
    headers,
  });
}
