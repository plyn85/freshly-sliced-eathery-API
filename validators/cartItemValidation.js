// imports
const baseValidators = require("./baseValidators.js");
const CartItem = require("../models/cartItems.js");
const validator = require("validator");
// needs to be validated before using in the application
let validateCartItem = (mealDetails, formCartItem, newCart) => {
  // Declare constants and variables
  let validatedCartItem;
  let cartItemId = 0;
  //the cartId field in the cart item will be the same as the cart that was created
  //and added to the db
  let cartId = newCart._id;
  //calculate the total for the cart item
  let total = mealDetails.meal_price * formCartItem.quantity;
  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCartItem(): Parameter is null");
  }

  if (
    baseValidators.validateId(cartItemId) &&
    baseValidators.validateId(cartId) &&
    baseValidators.validateId(mealDetails._id) &&
    !validator.isEmpty(mealDetails.meal_name) &&
    baseValidators.validatePositiveNumber(formCartItem.quantity) &&
    baseValidators.validatePrice(mealDetails.meal_price) &&
    baseValidators.validatePrice(total)
    // baseValidators.validatePrice(subTotal)
  ) {
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCartItem = new CartItem(
      cartItemId,
      cartId,
      mealDetails._id,
      validator.escape(mealDetails.meal_name),
      formCartItem.quantity,
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
