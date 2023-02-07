const mongoose = require("mongoose");

const Gumtree = mongoose.model(
  "Gumtree",
  new mongoose.Schema({
    prefNumber: String,
    link: String,
    runDate: Date
  })
);

module.exports = Gumtree;