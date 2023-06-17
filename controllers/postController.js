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

exports.viewSinglePost = async function (req, res) {
  try {
    let post = await Post.findBySingleId(req.params.id);
    res.render("post", { post: post });
  } catch {
    res.send("Post not found!");
  }
};
