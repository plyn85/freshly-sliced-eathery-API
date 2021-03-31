//imports
const cartRepository = require("../repositories/cartRepository");
const cartValidators = require("../validators/cartValidation");
const baseValidators = require("../validators/baseValidators.js");

//create a new meal
let addItemToCart = async (cartItem) => {
  //declare variable
  let newlyInsertedCartItem;
  //log to the console
  console.log("addItemToCart service: ", cartItem);
  //call the product validator kept in different file
  let validatedCartItem = cartValidators.validateCartItem(cartItem);
  //if the validator validates the product save to database

  if (validatedCartItem != null) {
    newlyInsertedCartItem = await cartRepository.addItemToCart(
      validatedCartItem
    );
  } else {
    //validation for product failed
    newlyInsertedCartItem = { error: "invalid cartItem" };

    //log the result
    console.log("cartService.addItemToCart(): form validation failed");
  }
  console.log("cart service newly inserted: ", newlyInsertedCartItem);
  //return the newly inserted meal
  return newlyInsertedCartItem;
};

//exports
module.exports = { addItemToCart };
