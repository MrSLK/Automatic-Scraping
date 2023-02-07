const controller = require("../Controllers/pp");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/pp", controller.pp);  
  app.get("/all-pp", controller.getAllPPData);
  app.get("/pp-counter", controller.getCounterPP)
  };