const express = require("express");
const router = express.Router();
const { createPostView, create } = require("../controllers/postController");
const { loginRequire } = require("../controllers/userController");

router.get("/create-post", loginRequire, createPostView);
router.post("/create-post", loginRequire, create);

module.exports = router;
