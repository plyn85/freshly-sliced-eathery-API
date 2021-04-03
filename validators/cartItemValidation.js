// imports
const baseValidators = require("./baseValidators.js");
const CartItem = require("../models/cartItems.js");

// needs to be validated before using in the application
let validateCartItem = (mealDetails, formCartItem, cart) => {
  // Declare constants and variables
  let validatedCartItem;
  let cartItemId = 0;
  let cartId = cart[0]._id;
  //calculate the total for the cart item
  let total = mealDetails.meal_price * formCartItem.quantity;
  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCartItem(): Parameter is null");
  }

  // Check if id field is included in the cart

  console.log(cart[0], "cart val");
  if (
    baseValidators.validateId(cartItemId) &&
    baseValidators.validateId(cartId) &&
    baseValidators.validateId(mealDetails._id) &&
    baseValidators.validatePositiveNumber(formCartItem.quantity) &&
    baseValidators.validatePrice(mealDetails.meal_price) &&
    baseValidators.validatePrice(total)
  ) {
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCartItem = new CartItem(
      cartItemId,
      cartId,
      mealDetails._id,
      formCartItem.quantity,
      mealDetails.meal_price,
      total
    );

    console.log(validatedCartItem, "cartItem val passed");
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