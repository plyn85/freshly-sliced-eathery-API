//imports
const menuRepository = require("../repositories/menuRepository");
const menuValidators = require("../validators/menuValidation");
const baseValidators = require("../validators/baseValidators.js");
// return all the meals items
let getMenu = async () => {
  const products = await menuRepository.getMenu();
  return products;
};

//create a new meal
let createMeal = async (meal) => {
  //declare variable
  let newlyInsertedMeal;
  //log to the console
  console.log("menu service: ", meal);
  //call the product validator kept in different file
  let validatedMeal = menuValidators.validateMeal(meal);
  //if the validator validates the product save to database

  if (validatedMeal != null) {
    newlyInsertedMeal = await menuRepository.createMeal(validatedMeal);
  } else {
    //validation for product failed
    newlyInsertedMeal = { error: "invalid meal" };

    //log the result
    console.log("productService.createMeal(): form validation failed");
  }
  console.log("menu service newly inserted: ", newlyInsertedMeal);
  //return the newly inserted meal
  return newlyInsertedMeal;
};

//get a meal by id
let getMealById = async (mealId) => {
  if (!baseValidators.validateId(mealId)) {
    console.log("getProductsByCatId service error: invalid id parameter");
    return "invalid parameter";
  }
  // console.log("meal id validated: ", mealId);

  //get the product if validation passed
  const meal = await menuRepository.getMealById(mealId);
  console.log("meal service :", meal);
  return meal;
};

//delete the meal by id
let deleteMeal = async (mealId) => {
  let deleteResult = false;
  //validate the input by call the id function form the base validators
  if (!baseValidators.validateId(mealId)) {
    console.log("deleteMeal service error: invalid id parameter");
    return false;
  }
  //delete meal by id
  deleteResult = await menuRepository.deleteMeal(mealId);
  // console.log(deleteResult, "meal service");

  return deleteResult;
};

//updates a  meal
let updateMeal = async (meal) => {
  console.log("put request");
  // Declare variables and constants
  let updatedMeal;
  // call the product validator
  let validatedMeal = menuValidators.validateMeal(meal);

  // If validation returned a product object - save to database
  if (validatedMeal != null) {
    updatedMeal = await menuRepository.updateMeal(validatedMeal);
  } else {
    // Product data failed validation
    updatedMeal = { error: "Meal update failed" };
    // debug info
    console.log("menuService.updateMeal(): form data validate failed");
  }
  return updatedMeal;
};
//exports
module.exports = {
  getMenu,
  createMeal,
  getMealById,
  deleteMeal,
  updateMeal,
};
