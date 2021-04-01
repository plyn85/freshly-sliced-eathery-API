// Input validation package
// https://www.npmjs.com/package/validator
const validator = require("validator");
const baseValidators = require("./baseValidators.js");

// models
// const Meal = require("../models/cartItems.js");
const CartItem = require("../models/cartItems.js");
// Validate the body data, sent by the client, for a new cartItem
// It needs to be validated before using in the application
let validateCartItem = (mealDetails, formCartItem) => {
  // Declare constants and variables
  let validatedCartItem;

  let cartItemId = 0;
  //calculate the total for the cart item
  let total = mealDetails.meal_price * formCartItem.quantity;

  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCartItem(): Parameter is null");
  }

  // Check if id field is included in the form object
  if (formCartItem.hasOwnProperty("_id")) {
    cartItemId = formCartItem._id;
  }

  if (
    baseValidators.validateId(cartItemId) &&
    baseValidators.validateId(mealDetails._id) &&
    baseValidators.validatePositiveNumber(formCartItem.quantity) &&
    baseValidators.validatePrice(mealDetails.meal_price) &&
    baseValidators.validatePrice(total)
  ) {
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCartItem = new CartItem(
      cartItemId,
      mealDetails._id,
      formCartItem.quantity,
      mealDetails.meal_price,
      total
    );
    console.log(validatedCartItem, "cart val passed");
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
