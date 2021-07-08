// Imports
const router = require("express").Router();
//const cartService = require("../services/cartService");

const { json } = require("body-parser");
const { request } = require("express");
//const passport = require("passport");

//login route
router.post("/login", async (req, res) => {
  //get the user data
  let userData = req.body;
  //get the email and password
  let email = userData.email;
  let password = userData.password;
  try {
    res.json(password);
  } catch (err) {
    res.send(err.message);
  }
});

// router.post("/", async (req, res) => {
//   try {
//     //get the meal id and the entire body from the body of the request
//     const cartItem = req.body;

//     //call the menu service pass them the mealDetails and the cartItem
//     const result = await cartService.addItemToCart(cartItem);
//     //console.log("controller", result);
//     //send the json result via http
//     res.json(result);
//   } catch (err) {
//     res.send(err.message);
//   }
// });
//export
module.exports = router;
