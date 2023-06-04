const express = require("express");
const app = express();
const home = require("./routers/home");

//use
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("views", "views");
app.set("view engine", "ejs");

// Routers
app.use("/", home);

// Listen
module.exports = app;
