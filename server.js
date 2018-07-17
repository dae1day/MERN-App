const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello test world"));
//route to slash '/' is basically the homepage, 2 parameters request and response (req, res), should display "hello world"

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
// what you type into the uri

const port = process.env.PORT || 5000;
//deploying to heroku so process.env.PORT OR || locally 5000

app.listen(port, () => console.log(`Server running on port ${port}`));
//pass in the port we want to listen and then put a callback or arrow function
// this should run our server
