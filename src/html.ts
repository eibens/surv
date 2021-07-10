export type HtmlOptions = {
  title?: string;
  body?: string;
};

export const html = (options: HtmlOptions) =>
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${options.title || "Untitled Website"}</title>
    <script defer type="module">
      import "./index.js"
    </script>
  </head>
  <body>${options.body || ""}</body>
</html>
`;
