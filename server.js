const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

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
app.use(flash());
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});
app.set("views", "views");
app.set("view engine", "ejs");

// Routers
const createPost = require("./routers/post");
const home = require("./routers/home");
app.use("/", home);
app.use("/", createPost);

// Listen
module.exports = app;
