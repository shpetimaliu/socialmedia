const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  home,
} = require("../controllers/userController");

router.get("/", home);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
