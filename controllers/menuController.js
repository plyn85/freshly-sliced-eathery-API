// Import router package
const router = require("express").Router();
//import menu service
const menuService = require("../services/menuService");

const { json } = require("body-parser");
//require the product service
//now all functions exported form the productService will be accessible to this controller
// const productService = require("../services/productService.js");

//menu route
router.get("/", async (req, res) => {
  //get products
  try {
    //call the menu service and get a list of the menu meals
    const result = await menuService.getMenu();
    //send the json result via http
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// export
module.exports = router;
