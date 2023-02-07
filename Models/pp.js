const mongoose = require("mongoose");

const PP = mongoose.model(
    "PP",
    new mongoose.Schema({
        prefNumber: String,
        link: String,
        runDate: Date
    })
);

module.exports = PP;