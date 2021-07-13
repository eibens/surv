import { assert } from "https://deno.land/std@0.101.0/testing/asserts.ts";
import { makeWebsite } from "./mod.ts";

Deno.test("makeWebsite", () => {
  assert(makeWebsite().match("website"));
});
