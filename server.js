const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const home = require("./routers/home");

const secretSession = process.env.SESSION_SECRET;

//session
let sessionRun = session({
  secret: secretSession,
  resave: false,
  store: new MongoStore({ client: require("./db") }),
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

//use
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionRun);
app.set("views", "views");
app.set("view engine", "ejs");

// Routers
app.use("/", home);

// Listen
module.exports = app;
