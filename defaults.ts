import { Options } from "./surv.ts";
import {
  blue,
  bold,
  italic,
  underline,
} from "https://deno.land/std@0.101.0/fmt/colors.ts";

const survUrl = "https://deno.land/x/surv";
const help = `
${bold("surv CLI")}

${italic(`This is the default help text.`)}

See: ${underline(blue(survUrl))}
`;

export function createOptions(options: Partial<Options> = {}): Options {
  return {
    docs: "docs",
    pages: {},
    build: [],
    help,
    wsHostname: "localhost",
    wsPort: 1234,
    server: null,
    modules: {},
    ...options,
  };
}
