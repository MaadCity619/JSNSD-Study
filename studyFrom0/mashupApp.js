const express = require("express");
const axios = require("axios");
const router = express.Router();

router
  .route("/rickAndMorty")
  .get(async (req, res) => {
    const numbers = await axios.get(
      "http://www.randomnumberapi.com/api/v1.0/random?min=1&max=20&count=2",
    );

    const character1 = await axios.get(
      `https://rickandmortyapi.com/api/character/${numbers.data[0]}`,
    );
    const character2 = await axios.get(
      `https://rickandmortyapi.com/api/character/${numbers.data[1]}`,
    );

    res.status(200).send({ 1: character1.data, 2: character2.data });
  })
  .all((req, res) => {
    res.status(403).send("Method not allowed");
  });

module.exports = router;
