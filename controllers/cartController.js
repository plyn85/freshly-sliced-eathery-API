// Imports
const router = require("express").Router();
const cartService = require("../services/cartService");

// add an item to the cart
router.post("/", async (req, res) => {
  //get the meal id and the entire body from the body of the request
  const cartItem = req.body;
  try {
    //call the menu service pass them the mealDetails and the cartItem
    const result = await cartService.addItemToCart(cartItem);
    console.log(" add Item to cart controller :", result);
    //send the json result via http
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//route to get all cart items from cart
router.get("/", async (req, res) => {
  //get the user id from the query sting
  let userId = req.query.id;
  try {
    const result = await cartService.getAllCartItems(userId);
    console.log(result);
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});
//route the cart by user id
router.get("/get-cart", async (req, res) => {
  //get the user id from the query sting
  let userId = req.query.id;

  try {
    //pass the user id to the service
    const result = await cartService.getCartByUserId(userId);
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//delete  a single cartItem
router.delete("/:id/:userId", async (req, res) => {
  //read the id parameter of the request url
  const cartItemId = req.params.id;
  const userId = req.params.userId;

  //get meal by id
  try {
    const result = await cartService.deleteCartItem(cartItemId, userId);
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

//update quantity route
router.put("/increaseQty", async (req, res) => {
  let mealData = req.body;
  console.log("mealData", mealData);

  try {
    let result = await cartService.changeQty(mealData);

    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//export
module.exports = router;
