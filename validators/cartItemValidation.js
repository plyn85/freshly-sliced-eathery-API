// imports
const baseValidators = require("./baseValidators.js");
const CartItem = require("../models/cartItems.js");
const validator = require("validator");
// needs to be validated before using in the application
let validateCartItem = (mealDetails, meal, cartId, total) => {
  //
  //console.log("meal deat", mealDetails.meal_description);
  // Declare constants and variables
  //
  let validatedCartItem;
  let id = 0;

  // debug to console - if no data
  //
  if (meal === null) {
    console.log("validateCartItem(): Parameter is null");
  }

  if (
    baseValidators.validateId(id) &&
    baseValidators.validateId(cartId) &&
    baseValidators.validateId(mealDetails._id) &&
    !validator.isEmpty(mealDetails.meal_name) &&
    !validator.isEmpty(mealDetails.meal_description) &&
    baseValidators.validatePositiveNumber(meal.quantity) &&
    baseValidators.validatePrice(mealDetails.meal_price) &&
    baseValidators.validatePrice(total)
    // baseValidators.validatePrice(subTotal)
  ) {
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCartItem = new CartItem(
      id,
      cartId,
      mealDetails._id,
      validator.escape(mealDetails.meal_name),
      validator.escape(mealDetails.meal_description),
      meal.quantity,
      mealDetails.meal_price,
      total
    );
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  return validatedCartItem;
};
// Module exports
// expose these functions
module.exports = {
  validateCartItem,
};
