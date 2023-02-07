const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.gumtree = require("./gumtree");
db.privateproperty = require("./private-property");
db.property24 = require("./property24");
db.myproperty = require("./myproperty");
db.pp = require("./pp");
db.prop24 = require("./prop24");

module.exports = db;

