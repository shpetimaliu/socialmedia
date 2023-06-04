const User = require("../models/user");

exports.home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-template", { errors: req.flash("errors") });
  }
};

exports.register = (req, res) => {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Thanks For register");
  }
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = { username: user.data.username };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(function (e) {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
