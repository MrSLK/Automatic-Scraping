const controller = require("../Controllers/private-property");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/Private-Property", controller.startPrivatePropertyScraping, controller.findDuplicates);
  app.get("/Get-All-Private-Property", controller.getAllPrivatePropertyData);
  app.get("/total-Private-property", controller.getCounterPrivateProperty);
  app.get('/remove-Private-Property-duplicates', controller.findDuplicates);
 };