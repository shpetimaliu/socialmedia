const User = require("../models/user");

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
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      res.send(e);
    });
};

exports.logout = () => {};
