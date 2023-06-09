const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  home,
  userExisting,
  profilePostsScreen,
} = require("../controllers/userController");

router.get("/profili/:username", userExisting, profilePostsScreen);

module.exports = router;
