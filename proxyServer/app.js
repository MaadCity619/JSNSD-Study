const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

app.use("/pokemon/:name", (req, res) => {
  const proxyMiddleware = createProxyMiddleware({
    target: `https://pokeapi.co/api/v2`,
    changeOrigin: true,
    pathRewrite: {
      "^/pokemon": `/pokemon/${req.params.name}`,
    },
  });
  proxyMiddleware(req, res);
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});
