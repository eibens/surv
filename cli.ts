import * as surv from "./mod.ts";
import {
  blue,
  bold,
  underline,
} from "https://deno.land/std@0.101.0/fmt/colors.ts";
import { createLogger, Logger } from "./logger.ts";

if (import.meta.main) {
  await cli({
    build: [{
      cmd: ["deno", "run", "-A", "https://deno.land/x/edcb@v0.5.1/cli.ts"],
    }],
  });
}

export type CliOptions = surv.Options & {
  logger: Logger;
  args: string[];
};

export async function cli(opts: Partial<CliOptions> = {}) {
  const options: CliOptions = {
    args: Deno.args,
    logger: createLogger({
      name: "surv",
    }),
    ...surv.createOptions(opts as Partial<surv.Options>),
  };
  const args = options.args;
  if (args.length > 1) {
    printInvalidArgs(options);
  } else if (args[0] === "--help") {
    printHelp(options);
  } else if (args[0] === "watch") {
    await runPageBundler(options);
    await runModuleBundler(options);
    startServer(options);
    startBundler(options);
    startReloader(options);
    options.logger.debug("-".repeat(32));
  } else if (!args.length) {
    await runPageBundler(options);
    await runModuleBundler(options);
    await runBuild(options);
  } else {
    printInvalidArgs(options);
  }
}

function printHelp(options: CliOptions) {
  const { log } = options.logger;
  log(options.help);
}

function printInvalidArgs(options: CliOptions) {
  const { error, debug } = options.logger;
  error("error");
  error("invalid arguments: " + options.args.join(" "));
  debug("for more information run: surv --help");
}

function startServer(options: CliOptions) {
  const { warn, debug, start, info } = options.logger;
  if (Object.keys(options.pages).length === 0) {
    warn("no pages are specified");
    debug("use `pages` option");
  }
  if (Object.keys(options.modules).length === 0) {
    debug("no modules are specified");
    debug("use `modules` option");
  }
  const httpUrl = `http://localhost:8080`;
  if (options.server) {
    start(`server started`);
    info(`server: ${blue(underline(httpUrl))}`);
    surv.startServer({
      server: options.server,
    });
  } else {
    warn(`server not specified`);
    debug("use `server` option");
  }
}

function startReloader(options: CliOptions) {
  const { start, info, error } = options.logger;
  start(`reloader started`);
  const wsUrl = `ws://${options.wsHostname}:${options.wsPort}`;
  info(`reloader: ${blue(underline(wsUrl))}`);
  surv.startReloader({
    ...options,
    handler: {
      connect: () => start(`websocket connected`),
      disconnect: () => start(`websocket disconnected`),
      error: (e) => error(`${bold(e.name)}: ${e.message}`),
    },
  });
}

function startBundler(options: CliOptions) {
  const { start, info } = options.logger;
  start("bundler started");
  surv.startBundler(options);
  info(`${Object.keys(options.pages).length} page(s) watched`);
}

async function runPageBundler(options: CliOptions) {
  const { start, success } = options.logger;
  start("bundler started");
  await surv.runPageBundler(options);
  success(`${Object.keys(options.pages).length} page(s) bundled`);
}

async function runModuleBundler(options: CliOptions) {
  const { start, success } = options.logger;
  start("bundler started");
  await surv.runModuleBundler(options);
  success(`${Object.keys(options.modules).length} modules(s) bundled`);
}

async function runBuild(options: CliOptions) {
  const { start, success } = options.logger;
  start("build started");
  await surv.runBuild(options);
  success(`${options.build.length} step(s) completed`);
}
