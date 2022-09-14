
const mongoose = require("mongoose");

const Property24 = mongoose.model(
  "Property24",
  new mongoose.Schema({
    price: String,
    title: String,
    address: String,
    bedroom: String,
    bathroom: String,
    size: String,
  })
);

module.exports = Property24;