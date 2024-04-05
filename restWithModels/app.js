const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const fruitsModel = require("./dbModel");
const { join } = require("path");
const { access, constants } = require("fs");

const app = express();

app.use(bodyParser.json());

app
  .route("/fruit/:id")
  .get((req, res) => {
    const callback = (error, result) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.status(200).send(result);
    };
    fruitsModel().read(req.params.id, callback);
  })
  .delete((req, res) => {
    fruitsModel().del(req.params.id, (error, result) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.status(200).send({ result });
    });
  })
  .all((req, res) => {
    res.status(405).send("Unauthorized Method");
  });

app.post("/fruit", (req, res) => {
  const callback = (error, result) => {
    if (error) {
      res.status(400).send(error);
      return;
    }
    res.status(200).send({ result });
  };
  fruitsModel().create(fruitsModel().uid(), req.body, callback);
});
app.use(express.static(join(__dirname, "views")));

app.route("/views/:name").get((req, res) => {
  const targetDirectory = join(__dirname, req.path);

  access(targetDirectory, constants.F_OK, (err) => {
    if (err) {
      res.status(404).send(err);
      return;
    }
    res.status(200).sendFile(targetDirectory);
  });
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(process.env.PORT);
