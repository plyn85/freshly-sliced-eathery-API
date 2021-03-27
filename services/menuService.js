//require the menu repository
const menuRepository = require("../repositories/menuRepository");
const menuValidators = require("../validators/menuValidation");
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
//exports
module.exports = {
  getMenu,
  createMeal,
};
