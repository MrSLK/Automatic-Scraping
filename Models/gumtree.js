const mongoose = require("mongoose");

const Gumtree = mongoose.model(
  "Gumtree",
  new mongoose.Schema({
    prefNumber: String
  })
);

module.exports = Gumtree;