const controller = require("../Controllers/gumtree");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/gumtree", controller.startGumtreeScraping);
  app.get("/get-all-gumtree", controller.getAllGumtreeData);
  app.get("/total-gumtree", controller.getCounterGumtree);
  };