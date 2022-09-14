const mongoose = require("mongoose");

const MyProperty = mongoose.model(
  "MyProperty",
  new mongoose.Schema({
    prefNumber: String
  })
);

module.exports = MyProperty;