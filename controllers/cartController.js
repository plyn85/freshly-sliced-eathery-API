// Imports
const router = require("express").Router();

const cartService = require("../services/cartService");

const { json } = require("body-parser");

//post route for meals
router.post("/", async (req, res) => {
  try {
    //get the cartItem from the request body
    const cartItem = req.body;
    // console.log("Post Cart item route :", cart);
    //call the menu service
    const result = await cartService.addItemToCart(cartItem);
    //send the json result via http
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

// export
module.exports = router;
