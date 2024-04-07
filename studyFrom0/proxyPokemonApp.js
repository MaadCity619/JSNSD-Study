const express = require("express");
const router = express.Router();
const { createProxyMiddleware } = require("http-proxy-middleware");

router.use("/pokemon:/id", (req, res) => {
  console.log("entered");
  const proxy = createProxyMiddleware({
    target: `https://pokeapi.co/api/v2/pokemon/${req.params.id}`,
    changeOrigin: true,
  });
  proxy(req, res);
});

module.exports = router;
