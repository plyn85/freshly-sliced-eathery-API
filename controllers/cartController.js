// Imports
const router = require("express").Router();
const menuService = require("../services/menuService");
const cartService = require("../services/cartService");

const { json } = require("body-parser");

//post route for meals
router.post("/", async (req, res) => {
  try {
    //get the meal id and the quantity from the body
    // and the cartItem
    const cartItem = req.body;
    const meal_id = req.body.meal_id;
    //get a single meal by id with the meal id form the request body as the paramter
    const mealDetails = await menuService.getMealById(meal_id);
    //call the menu service pass them the mealDetails and the quantity
    const result = await cartService.addItemToCart(mealDetails, cartItem);
    //send the json result via http
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//route to get all cart items from cart
router.get("/", async (req, res) => {
  try {
    const cart = await cartService.getCart();
    res.send(cart);
  } catch (err) {
    res.send(err.message);
  }
});
// export
module.exports = router;
