import * as esbuild from "esbuild";
import http from "node:http";
import fs from "node:fs";
// Start esbuild's server on a random local port
let ctx = await esbuild.context({
  // ... your build options go here ...
  bundle: true,
  entryPoints: ["./main.js"],
  outfile: "./main.bundle.js",
});

// The return value tells us where esbuild's local server is
let { host, port } = await ctx.serve({ servedir: "." });

// Then start a proxy server on port 3000
http
  .createServer((req, res) => {
    const options = {
      hostname: host,
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // Forward each incoming request to esbuild
    const proxyReq = http.request(options, (proxyRes) => {
      // If esbuild returns "not found", send a custom 404 page
      if (proxyRes.statusCode === 404) {
        res.writeHead(404, { "Content-Type": "text/html" });
        // ./404.html
        const c = fs.readFileSync("./404.html", "utf8");
        res.end(c);
        return;
      }

      // Otherwise, forward the response from esbuild to the client
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  })
  .listen(3000);
