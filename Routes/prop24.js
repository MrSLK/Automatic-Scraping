const controller = require("../Controllers/prop24");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/prop-24", controller.prop24);
  app.post("/send-p24-data", controller.sendP24Data);
  
  app.get("/get-all-Property-24", controller.getAllProperty24Data);
  app.get("/total-Property-24", controller.getCounterProperty24);

  };