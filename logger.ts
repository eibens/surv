import {
  cyan,
  gray,
  green,
  magenta,
  red,
  yellow,
} from "https://deno.land/std@0.101.0/fmt/colors.ts";

export type LoggerOptions = {
  name?: string;
};

export type LoggerTag =
  | "log"
  | "info"
  | "success"
  | "warn"
  | "error"
  | "start"
  | "debug"

export type Logger = Record<LoggerTag, (msg: string) => void>;

export function createLogger(options: LoggerOptions): Logger {
  const logger = (
    log: (x: string) => void,
    format: (x: string) => string = (x) => x,
  ) => {
    return (msg: string) => {
      const tagged = msg ? `[${options.name}] ${msg}` : msg;
      log(format(tagged));
    };
  };
  return {
    log: logger(console.log),
    info: logger(console.log, cyan),
    success: logger(console.info, green),
    error: logger(console.log, red),
    warn: logger(console.log, yellow),
    start: logger(console.info, magenta),
    debug: logger(console.debug, gray)
  };
}
