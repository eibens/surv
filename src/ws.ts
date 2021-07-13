import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std@0.95.0/ws/mod.ts";

// NOTE: Once WebSocket support works with `Deno.listen` or `Deno.listenHttp`, we can use these native APIs. For now I only know how to use WebSockets with the `std/http` interface.
import { serve as serveHttp } from "https://deno.land/std@0.95.0/http/mod.ts";

export type ServeWsHandler = {
  connect: (socket: WebSocket) => void;
  disconnect: (socket: WebSocket) => void;
  error: (error: Error) => void;
};

function createHandler(handler: Partial<ServeWsHandler> = {}): ServeWsHandler {
  return {
    connect: () => void (0),
    disconnect: () => void (0),
    error: () => void (0),
    ...handler,
  };
}

export type ServeWsOptions = {
  port: number;
  hostname?: string;
  handler?: Partial<ServeWsHandler>;
};

export function serveWs(options: ServeWsOptions) {
  const handler = createHandler(options.handler);
  const listener = serveHttp(options);
  const sockets = new Set<WebSocket>();

  // Start accepting HTTP requests.
  (async () => {
    for await (const request of listener) {
      (async () => {
        try {
          // Use this slightly inconvenient native API to upgrade the connection.
          const { conn, r: bufReader, w: bufWriter, headers } = request;
          const ws = await acceptWebSocket({
            conn,
            bufReader,
            bufWriter,
            headers,
          });

          // Add new connection.
          sockets.add(ws);
          handler.connect(ws);

          // Wait for close event.
          // NOTE: For now we ignore all other events.
          try {
            for await (const event of ws) {
              try {
                if (isWebSocketCloseEvent(event)) {
                  sockets.delete(ws);
                  handler.disconnect(ws);
                  break;
                }
              } catch (error) {
                if (error instanceof Deno.errors.ConnectionReset) {
                  // NOTE: Happens if socket has already been closed.
                } else {
                  throw error;
                }
              }
            }
          } catch (error) {
            if (error instanceof Deno.errors.ConnectionReset) {
              // NOTE: Happens if socket has already been closed.
            } else if (error instanceof Deno.errors.BadResource) {
              // NOTE: Use same strategy as Deno std.
              // https://deno.land/std@0.95.0/http/server.ts#L131
            } else {
              throw error;
            }
          }
        } catch (error) {
          handler.error(error);
        }
      })();
    }
  })();

  let closed = false;
  function assertNotClosed() {
    if (closed) {
      throw new Error("Server is already closed.");
    }
  }

  return {
    close: async () => {
      assertNotClosed();
      closed = true;

      // NOTE: Close the sockets before closing the server, otherwise a `BadResource: Bad resource ID` error will be thrown.
      await Promise.all(Array.from(sockets).map((ws) => ws.close()));

      // Stop listening for new connections.
      listener.close();
    },
    send: (data: unknown = "") => {
      assertNotClosed();
      sockets.forEach((ws) => {
        ws.send(String(data));
      });
      return Promise.resolve();
    },
  };
}

export function broadcast(options: ServeWsOptions) {
  return serveWs(options).send;
}
