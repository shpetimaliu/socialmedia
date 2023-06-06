const express = require("express");
const router = express.Router();
const { createPostView } = require("../controllers/postController");
const { loginRequire } = require("../controllers/userController");

router.get("/create-post", loginRequire, createPostView);

module.exports = router;
