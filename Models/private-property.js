const mongoose = require("mongoose");

const PrivateProperty = mongoose.model(
    "PrivateProperty",
    new mongoose.Schema({
        province: String,
        title: String,
        monthly_rent: String,
        property_type: String,
        area: String,
        city: String,
        suburb: String,
        features: String,
        number_of_bedrooms: String,
        number_of_bathrooms: String,
        garage: String,
        reference: String
    })
);

module.exports = PrivateProperty;