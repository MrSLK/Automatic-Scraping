const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

app.use(express.json());

mongoose.connect('mongodb+srv://shiba:5Dswu1WmuaK97pTj@cluster0.ln0xh6f.mongodb.net/scraping?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

require("./Routes/gumtree")(app);
require("./Routes/myproperty")(app);
require("./Routes/private-property")(app);
require("./Routes/pp")(app);
// require("./Routes/property24")(app);
require("./Routes/prop24")(app);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});