//imports
const baseValidators = require("./baseValidators.js");
const Cart = require("../models/cart.js");

//needs to be validated before being used in the application

let validateCart = (subTotal) => {
  //declare variables and constants
  let validatedCart;
  let id = 0;
  let userId = 1;

  if (
    baseValidators.validateId(id) &&
    baseValidators.validateId(userId) &&
    baseValidators.validatePrice(subTotal)
  ) {
    // Validation passed
    console.log("validation passed cartValidation");
    // create a new cart instance based on Cart model object
    validatedCart = new Cart(id, userId, subTotal);
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  //return the validated and created cart and cartItems
  return validatedCart;
};

//exports
module.exports = { validateCart };
