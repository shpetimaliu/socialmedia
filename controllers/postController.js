const Post = require("../models/post");

exports.createPostView = function (req, res) {
  res.render("create-post");
};

exports.create = function (req, res) {
  let post = new Post(req.body, req);
  console.log(req.session.user._id);
  post
    .create()
    .then(() => {
      res.send("wowww");
    })
    .catch((errors) => {
      res.send(errors);
    });
};
