const controller = require("../Controllers/private-property");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/Private-Property", controller.startPrivatePropertyScraping);
  app.get("/private-properties", controller.getAllPrivatePropertyData);
  app.get("/private-properties-counter", controller.getCounterPrivateProperty)
 };