// Imports
const router = require("express").Router();
const usersService = require("../services/usersService");

const { json } = require("body-parser");
const { request } = require("express");
//const passport = require("passport");

//login route
router.post("/login", async (req, res) => {
  //get the user data
  const userData = req.body;
  try {
    const result = await usersService.loginUser(userData);
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//export
module.exports = router;
