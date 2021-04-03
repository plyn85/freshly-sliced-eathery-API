//imports
const baseValidators = require("./baseValidators.js");
const Cart = require("../models/cart.js");

//needs to be validated before being used in the application

let validateCart = (mealDetails, formCartItem) => {
  //declare variables and constants
  let validatedCart;
  let validatedCartItem;
  let id = 1;
  let userId = 1;
  let cartItemId = 0;
  let cartId = 1;
  //calculate the subtotal for the cart an total for the cart item
  let { subTotal, total } = mealDetails.meal_price * formCartItem.quantity;

  // debug to console - if no data
  if (formCartItem === null) {
    console.log("validateCart(): Parameter is null");
  }

  if (
    baseValidators.validateId(id) &&
    baseValidators.validateId(userId) &&
    baseValidators.validatePrice(subTotal) &&
    baseValidators.validateId(cartItemId) &&
    baseValidators.validateId(cartId) &&
    baseValidators.validateId(mealDetails._id) &&
    baseValidators.validatePositiveNumber(formCartItem.quantity) &&
    baseValidators.validatePrice(mealDetails.meal_price) &&
    baseValidators.validatePrice(total)
  ) {
    // Validation passed
    // create a new cart instance based on Cart model object
    validatedCart = new Cart(id, userId, subTotal);
    //add a  new cart item once the cart is first created
    validatedCartItem = new CartItem(
      cartItemId,
      cartId,
      mealDetails._id,
      formCartItem.quantity,
      mealDetails.meal_price,
      total
    );

    console.log(validatedCart, "cart val passed");
  } else {
    // debug
    console.log("validateCartItem(): Validation failed");
  }
  return { validatedCart, validatedCartItem };
};

//exports
module.exports = { validateCart };
