const express = require("express");
const { join } = require("path");
const fs = require("fs");
require("dotenv").config();
const rickRouter = require("./mashupApp");
const httpErrors = require("http-errors");

const app = express();

app.use(rickRouter);

const bannedIps = [];

app.use((req, res, next) => {
  if (bannedIps.includes(req.ip)) {
    res.status(400).send("Bad request");
    return;
  }
  next();
});

const { createProxyMiddleware } = require("http-proxy-middleware");

app.use("/pokemon/:id", (req, res) => {
  console.log("entered");
  const proxy = createProxyMiddleware({
    target: `https://pokeapi.co/api/v2/pokemon/${req.params.id}`,
    changeOrigin: true,
  });
  proxy(req, res);
});

app
  .route("/root")
  .get((req, res) => {
    res.status(200).send("Welcome to root");
  })
  .all((req, res) => {
    res.status(400).send("Method not allowed");
  });

app.use(express.static(join(__dirname, "/views")));

app
  .route("/views/:page")
  .get((req, res) => {
    const targetPath = join(__dirname, req.url);

    fs.access(targetPath, fs.constants.F_OK, (e) => {
      if (e) {
        res.status(400).send("Bad request");
      } else {
        res.sendFile(targetPath);
      }
    });
  })
  .all((req, res) => {
    res.status(400).send("Method not allowed");
  });

app.use((req, res) => {
  res.status(404).send(httpErrors(404));
});

app.listen(process.env.PORT);
