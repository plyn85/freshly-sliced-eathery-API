//imports
const cartRepository = require("../repositories/cartRepository");
const cartValidators = require("../validators/cartValidation");

//add a new cart item to the cart
let addItemToCart = async (mealDetails, cartItem) => {
  //declare variable
  let newlyInsertedCartItem;
  //log to the console
  console.log("addItemToCart service: ", mealDetails, cartItem, "cart service");
  //call the product validator and pass in the meal details and the item quantity
  let validatedCartItem = cartValidators.validateCartItem(
    mealDetails,
    cartItem
  );
  //if the validator validates the cartItem to database

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

// return all the cart items
let getCart = async () => {
  const cart = await cartRepository.getCart();
  return cart;
};

//exports
module.exports = { addItemToCart, getCart };
