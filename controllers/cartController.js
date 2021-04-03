// Imports
const router = require("express").Router();
const menuService = require("../services/menuService");
const cartService = require("../services/cartService");

const { json } = require("body-parser");

//post route will add item to cart if it exists
// and if it does not it will create a cart and then add an item
router.post("/", async (req, res) => {
  try {
    //get the meal id and the entire body from the body of the request
    const cartItem = req.body;
    const meal_id = req.body.meal_id;
    //get a single meal by id and match with the meal id from the request body as the paramter
    const mealDetails = await menuService.getMealById(meal_id);
    //call the menu service pass them the mealDetails and the cartItem
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
    const result = await cartService.getAllCartItems();
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//delete  a single cartItem
router.delete("/:id", async (req, res) => {
  //read the id parameter of the request url
  const cartItemId = req.params.id;
  // console.log("delete a cartItem controller :", cartItemId);
  //get meal by id
  try {
    const result = await cartService.deleteCartItem(cartItemId);
    //should return true or false
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

//delete  a cart
router.delete("/empty-cart/:id", async (req, res) => {
  //read the id parameter of the request url
  const cartId = req.params.id;
  // console.log("delete a cartItem controller :", cartItemId);
  //get meal by id
  try {
    const result = await cartService.deleteCart(cartId);
    //should return true or false
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});
// export
module.exports = router;
