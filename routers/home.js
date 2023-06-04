const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("home-template");
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
