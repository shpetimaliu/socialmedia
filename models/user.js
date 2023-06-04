const userCollect = require("../db").collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide an username");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide an password");
  }
  if (this.data.password.length > 0 && this.data.password.length < 8) {
    this.errors.push("You must provide an password with min 12 character");
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password cannot exceed 100 character");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("You must provide an username with min 3 character");
  }
  if (this.data.username.length > 100) {
    this.errors.push("Username cannot exceed 100 character");
  }
};

User.prototype.register = function () {
  this.validate();
  this.cleanUp();

  if (!this.errors.length) {
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    userCollect.insertOne(this.data);
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    userCollect
      .findOne({ username: this.data.username })
      .then((attemptLogin) => {
        if (
          attemptLogin &&
          bcrypt.compareSync(this.data.password, attemptLogin.password)
        ) {
          resolve("congrats!!");
        } else {
          reject("Invalid user/password");
        }
      })
      .catch(() => {
        reject("Please try again later");
      });
  });
};

module.exports = User;
