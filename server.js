// const express = require("express");
// // const cors = require("cors");
// const app = express();

// // var corsOptions = {
// //   origin: "*"
// // };
// app.use(cors(corsOptions));
// // parse requests of content-type - application/json
// app.use(express.json());
// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running" });
// });

// //Connect Database
// db.mongoose
//   .connect(`mongodb+srv://shiba:T3wV6lsQTNCcDU4V@cluster0.ln0xh6f.mongodb.net/application-form?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//   })
//   .catch(err => {
//     console.error("Connection error ", err);
//     process.exit();
//   });

// // set port, listen for requests
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });


const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://shiba:T3wV6lsQTNCcDU4V@cluster0.ln0xh6f.mongodb.net/scraping?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});