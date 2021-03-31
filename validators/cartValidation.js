// Input validation package
// https://www.npmjs.com/package/validator
const validator = require("validator");
const baseValidators = require("./baseValidators.js");

// models
// const Meal = require("../models/cartItems.js");
const CartItem = require("../models/cartItems.js");
// Validate the body data, sent by the client, for a new cartItem
// It needs to be validated before using in the application
let validateCartItem = (formCartItem) => {
  // Declare constants and variables
  let validatedCartItem;

  let cartItemId = 0;

  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateNewMeal(): Parameter is null");
  }

  // Check if id field is included in the form object
  if (formCartItem.hasOwnProperty("_id")) {
    cartItemId = formCartItem._id;
  }

  if (
    baseValidators.validateId(cartItemId) &&
    baseValidators.validateId(formCartItem.meal_id) &&
    baseValidators.validatePositiveNumber(formCartItem.quantity) &&
    baseValidators.validatePrice(formCartItem.price) &&
    baseValidators.validatePrice(formCartItem.total)
  ) {
    console.log("first stage validation passed :", formCartItem);
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCartItem = new CartItem(
      formCartItem._id,
      formCartItem.meal_id,
      formCartItem.quantity,
      formCartItem.price,
      formCartItem.total
    );
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  //   console.log("second stage validation passed :", validatedMeal);
  // return new validated product object
  console.log("val", validatedCartItem);
  return validatedCartItem;
};
// Module exports
// expose these functions
module.exports = {
  validateCartItem,
};
