const Post = require("../models/post");

exports.createPostView = function (req, res) {
  res.render("create-post");
};

exports.create = function (req, res) {
  let post = new Post(req.body, req);
  console.log(req.session.user._id.toString());
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
    let post = await Post.findBySingleId(req.params.id, req.visitorId);
    res.render("post", { post: post });
  } catch {
    res.render("404");
  }
};

exports.viewEditPost = async function (req, res) {
  try {
    let post = await Post.findBySingleId(req.params.id);

    res.render("edit-post", { post: post });
  } catch {
    res.render("404");
  }
};

exports.edit = function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id);
  post
    .update()
    .then((status) => {
      if (status == "success") {
        req.flash("success", "Post updated successfully");
        req.session.save(() => {
          res.redirect(`/post/${req.params.id}`);
        });
      } else {
        post.errors.forEach((error) => {
          req.flash("errors", error);
        });
        req.session.save(() => {
          res.redirect(`/post/${req.params.id}/edit`);
        });
      }
    })
    .catch(() => {
      //Ky catch esht shtu shkaku se nese ni user e kerkon ni postim me id qe esht fshi prej databaze ose nuk egziston, ose edhe nese aj munohet me bo edit nese nuk osht owner i ati posti aj e merr ni flash error
      req.flash("errors", "You don't have permission to perform this action!");
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
