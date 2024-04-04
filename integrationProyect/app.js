const express = require("express");
const path = require("path");
const fs = require("node:fs");

const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

express.static(path.join(__dirname, "views"));

const blackList = [];

app.use((req, res, next) => {
  if (blackList.includes(req.ip)) {
    res.status(400).send("Could not access");
  }
  next();
});

app.use("/pokemon/:firstName", (req, res) => {
  if (req.method !== "GET") {
    res.status(400).send("Operation not allowed");
  }
  const proxyMiddleware = createProxyMiddleware({
    target: `https://pokeapi.co/api/v2`,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Dynamically rewrite the path to include firstName
      console.log(path);
      return path.replace(/^\/pokemon/, `/pokemon/${req.params.firstName}`);
    },
  });

  proxyMiddleware(req, res);
});

// app
//   .route("/pokemon/:firstName")
//   .get(async (req, res) => {
//     const firstName = req.params.firstName;
//     const secondName = req.params.secondName;
//
//     const proxyMiddleware = createProxyMiddleware({
//       target: `https://pokeapi.co/api/v2/pokemon/${firstName}`,
//       changeOrigin: true,
//     });
//
//     const firstCall = res.status(200).send("Called pokemon");
//   })
//   .all((req, res) => {
//     res.status(405).send("Method not allowed");
//   });

app.route("/views/:page").get((req, res) => {
  const basePath = __dirname;

  const targetPath = path.join(basePath, req.url);

  console.log(targetPath);

  fs.access(`${targetPath}.html`, fs.constants.F_OK, (err) => {
    if (err) {
      res.send("<h1>404 Not Found<h1>");
    } else {
      console.log("File exists");
      res.sendFile(`${targetPath}.html`);
    }
  });
});

app.use((req, res) => {
  res.status(404).send("Could not find service");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
