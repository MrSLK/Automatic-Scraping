const mongoose = require("mongoose");

const Prop24 = mongoose.model(
    "Prop24",
    new mongoose.Schema({
        prefNumber: String,
        link: String,
        runDate: Date
    })
);

module.exports = Prop24;