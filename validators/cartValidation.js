//imports
const baseValidators = require("./baseValidators.js");
const Cart = require("../models/cart.js");

//needs to be validated before being used in the application

let validateCart = (mealDetails, formCartItem) => {
  //declare variables
  let validatedCart;
  //set the cart id (PK) to match the cartId from cart
  //item (FK)
  let id = 1;
  let userId = 1;
  let subTotal = mealDetails.meal_price * formCartItem.quantity;
  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCart(): Parameter is null");
  }

  if (
    baseValidators.validateId(id) &&
    baseValidators.validateId(userId) &&
    baseValidators.validatePrice(subTotal)
  ) {
    // Validation passed
    // create a new cart instance based on Cart model object
    validatedCart = new Cart(id, userId, subTotal);

    console.log(validatedCart, "cart val passed");
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  return validatedCart;
};

//exports
module.exports = { validateCart };
