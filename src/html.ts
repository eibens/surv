export const renderHtml = (options: {
  title?: string;
  body?: string;
}) =>
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
