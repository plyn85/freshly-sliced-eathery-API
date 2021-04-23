// Imports
const router = require("express").Router();
const cartService = require("../services/cartService");

const { json } = require("body-parser");
const { request } = require("express");

// add an item to the cart
router.post("/", async (req, res) => {
  try {
    //get the meal id and the entire body from the body of the request
    const cartItem = req.body;
    //console.log(cartItem);
    //call the menu service pass them the mealDetails and the cartItem
    const result = await cartService.addItemToCart(cartItem);
    //console.log("controller", result);
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
  //console.log(userId);
  // console.log("delete a cartItem controller :", cartItemId);
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

//update quantity route
router.put("/increaseQty", async (req, res) => {
  let mealData = req.body;
  console.log("mealData", mealData);
  console.log(req.params.id);

  try {
    let result = await cartService.changeQty(mealData);
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//to handle stripe payments
router.post("/payment/:id", async (req, res) => {
  //get stipe body and cart id from the request body
  let stripeBody = req.body;
  let cartId = req.params.id;
  console.log(stripeBody);
  try {
    let result = await cartService.stripeHandlePayment(stripeBody, cartId);
    console.log("cartc", result);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//to handle collection info
router.post("/collection", async (req, res) => {
  //getting the body of the request
  let customerData = req.body;
  console.log(customerData);
  //sending the request body to collection function
  try {
    let result = await cartService.createCustomer(customerData);
    console.log("collection order", result._id);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//export
module.exports = router;
