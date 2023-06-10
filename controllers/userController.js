const User = require("../models/user");

exports.loginRequire = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "You must be logged in to create a post");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.home = (req, res) => {
  if (req.session.user) {
    res.render("home-dashboard");
  } else {
    res.render("home-template", {
      errors: req.flash("errors"),
      RegErrors: req.flash("RegErrors"),
    });
  }
};

exports.register = (req, res) => {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        username: user.data.username,
        profile: user.profile,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((RegErrors) => {
      RegErrors.forEach((error) => {
        req.flash("RegErrors", error);
      });
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = {
        profile: user.profile,
        username: user.data.username,
      };
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
