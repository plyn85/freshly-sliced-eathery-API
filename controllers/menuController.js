// Imports
const router = require("express").Router();

const menuService = require("../services/menuService");

const { json } = require("body-parser");

//get route for meals
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

//post route adds a meal
router.post("/", async (req, res) => {
  try {
    //get the meal from the request body
    const meal = req.body;

    //call the menu service
    const result = await menuService.createMeal(meal);
    //send the json result via http
    res.json(result);
  } catch (err) {
    res.send(err.message);
  }
});

//get a single meal route
router.get("/:id", async (req, res) => {
  //read the id parameter of the request url
  const mealId = req.params.id;

  //get meal by id
  try {
    const result = await menuService.getMealById(mealId);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

//delete  a single meal route
router.delete("/:id", async (req, res) => {
  //read the id parameter of the request url
  const mealId = req.params.id;

  //get meal by id
  try {
    const result = await menuService.deleteMeal(mealId);
    //should return true or false
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

// PUT update a  meal
router.put("/", async (req, res) => {
  // the request body contains the new meal values - copy it
  const meal = req.body;
  console.log(meal);
  // show what was copied in the console (server side)
  console.log("mealController update: ", meal);

  try {
    result = await menuService.updateMeal(meal);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});
// export
module.exports = router;
