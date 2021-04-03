//imports
const baseValidators = require("./baseValidators.js");
const Cart = require("../models/cart.js");

//needs to be validated before being used in the application

let validateCart = (mealDetails, formCartItem) => {
  //declare variables and constants
  let validatedCart;
  let id = 0;
  let userId = 1;
  //calculate the subtotal for the cart an total for the cart item
  let total = mealDetails.meal_price * formCartItem.quantity;
  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCart(): Parameter is null");
  }

  if (
    baseValidators.validateId(id) &&
    baseValidators.validateId(userId) &&
    baseValidators.validatePrice(total)
  ) {
    // Validation passed
    console.log("validation passed cartValidation");
    // create a new cart instance based on Cart model object
    validatedCart = new Cart(id, userId, total);
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  //return the validated and created cart and cartItems
  return validatedCart;
};

//exports
module.exports = { validateCart };
