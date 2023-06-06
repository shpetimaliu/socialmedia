exports.createPostView = function (req, res) {
  res.render("create-post", {
    username: req.session.user.username,
    profile: req.session.user.profile,
  });
};
