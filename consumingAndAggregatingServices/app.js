const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.route("/naruto/:id").get(async (req, res) => {
  const name = req.query.name;
  const data = await axios.get(
    `https://narutodb.xyz/api/character/search?name=${name}`,
  );
  const idData = await axios.get(
    `https://narutodb.xyz/api/character/${req.params.id}`,
  );

  res.status(200).json({ first: data.data, second: idData.data });
});

app.listen(process.env.PORT, () => {
  console.log(`App starting on port ${process.env.PORT}`);
});
