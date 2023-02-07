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
        reference: String,
        runDate: Date
    })
);

module.exports = PrivateProperty;

// const mongoose = require('mongoose');
// const db = mongoose.connection.useDb('scraping')
// const PrivateProperty = mongoose.model(
//     "PrivateProperty",
//     new mongoose.Schema({
//         province: String,
//         title: String,
//         monthly_rent: String,
//         property_type: String,
//         area: String,
//         city: String,
//         suburb: String,
//         features: String,
//         number_of_bedrooms: String,
//         number_of_bathrooms: String,
//         garage: String,
//         reference: String,
//         runDate: Date
//     })
// );
// const collection = db.model('pp3', PrivateProperty);

// module.exports = { collection }