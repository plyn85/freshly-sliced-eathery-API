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

//post route for meals
router.post("/", async (req, res) => {
  try {
    //get the meal from the request body
    const meal = req.body;
    // console.log("Post route meal :", meal);
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
  // let result;
  //read the id parameter of the request url
  const mealId = req.params.id;
  // console.log(mealId, "controller");
  //get meal by id
  try {
    const result = await menuService.getMealById(mealId);
    res.json(result);
    // console.log(result, "result meal id controller");
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

//delete  a single meal route
router.delete("/:id", async (req, res) => {
  // let result;
  //read the id parameter of the request url
  const mealId = req.params.id;
  // console.log("meal controller mealId :", mealId);
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
// export
module.exports = router;
