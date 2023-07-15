const User = require("../models/user");
const Post = require("../models/post");
const { post } = require("../server");

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
        _id: user.data._id,
      };
      console.log(user.data._id);
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
        _id: user.data._id,
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

exports.userExisting = (req, res, next) => {
  User.findByUsername(req.params.username)
    .then((userDocument) => {
      req.profileUser = userDocument;
      next();
    })
    .catch(() => {
      res.render("404");
    });
};

exports.profilePostsScreen = (req, res) => {
  Post.findByAuthorId(req.profileUser._id)
    .then((posts) => {
      res.render("profili", {
        posts: posts,
        profileUsername: req.profileUser.username,
        profileProfili: req.profileUser.profile,
      });
    })
    .catch(() => {
      res.render("404");
    });
};
