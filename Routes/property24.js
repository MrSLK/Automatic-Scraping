const controller = require("../Controllers/property24");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/Property-24", controller.startProperty24Scraping);
  app.get("/get-all-Property-24", controller.getAllProperty24Data);
  };