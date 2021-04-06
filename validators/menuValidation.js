// Input validation package
// https://www.npmjs.com/package/validator
const validator = require("validator");
const baseValidators = require("./baseValidators.js");

// models
const Meal = require("../models/meals.js");
//validation function
let validateMeal = (formMeal) => {
  // Declare constants and variables
  let validatedMeal;
  // New product has no id
  let mealId = 0;

  // debug to console - if no data
  if (formMeal === null) {
    console.log("validateNewMeal(): Parameter is null");
  }

  // Check if id field is included in the form object
  if (formMeal.hasOwnProperty("_id")) {
    mealId = formMeal._id;
  }

  if (
    baseValidators.validateId(mealId) &&
    !validator.isEmpty(formMeal.meal_name) &&
    !validator.isEmpty(formMeal.meal_description) &&
    baseValidators.validatePrice(formMeal.meal_price)
  ) {
    validatedMeal = new Meal(
      mealId,
      // escape is to sanitize - it removes/ encodes any html tags
      validator.escape(formMeal.meal_name),
      validator.escape(formMeal.meal_description),
      formMeal.meal_price
    );
  } else {
    // debug
    console.log("validateNewMeal(): Validation failed");
  }

  return validatedMeal;
};
// exports

module.exports = {
  validateMeal,
};
