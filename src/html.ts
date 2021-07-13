export type HtmlOptions = {
  modules: string[];
  title?: string;
  body?: string;
};

export const module = (options: {
  name: string;
}) =>
  `
<script defer type="module">
  import "${options.name}"
</script>
`.trim();

export const html = (options: HtmlOptions) =>
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${options.title || "Untitled Website"}</title>
    ${options.modules.map((name) => module({ name })).join()}
  </head>
  <body>${options.body || ""}</body>
</html>
`.trimStart();
