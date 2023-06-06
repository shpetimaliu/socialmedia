const express = require("express");
const router = express.Router();
const { createPostView } = require("../controllers/postController");

router.get("/create-post");
