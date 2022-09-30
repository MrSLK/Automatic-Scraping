
const mongoose = require("mongoose");

const Property24 = mongoose.model(
  "Property24",
  new mongoose.Schema({
    newPrice: String,
    newSize: String,
    fullAddress: String,
    propertyType: String,
    title: String,
    runDate: Date
  })
);

module.exports = Property24;