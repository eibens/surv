import { Options } from "./surv.ts";
import * as surv from "./mod.ts";
import {
  blue,
  bold,
  italic,
  underline,
} from "https://deno.land/std@0.101.0/fmt/colors.ts";

const survUrl = "https://deno.land/x/surv";

const body = `
<h1>Untitled Surv Website</h1>
<p>Empty website generated with <a href="${survUrl}" target="_blank">surv</a>.</p>
`.trim();

const html = surv.html({
  body,
  title: "Untitled",
  modules: [],
});

const help = `
${bold("surv CLI")}

${italic(`This is the default help text.`)}

See: ${underline(blue(survUrl))}
`;

export function createOptions(options: Partial<Options> = {}): Options {
  return {
    docs: "docs",
    pages: {
      index: html,
    },
    build: [],
    help,
    wsHostname: "localhost",
    wsPort: 1234,
    server: null,
    modules: {},
    ...options,
  };
}
