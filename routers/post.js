const express = require("express");
const router = express.Router();
const {
  createPostView,
  create,
  viewSinglePost,
} = require("../controllers/postController");

const { loginRequire } = require("../controllers/userController");

router.get("/create-post", loginRequire, createPostView);
router.post("/create-post", loginRequire, create);
router.get("/post/:id", viewSinglePost);

module.exports = router;
