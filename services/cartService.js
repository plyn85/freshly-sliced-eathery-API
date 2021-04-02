//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const cartValidation = require("../validators/cartValidation");
//add a new cart item to the cart
let addItemToCart = async (mealDetails, cartItem) => {
  //call the cart repo
  const cart = await cartRepository.getCart();
  //if the cart exits
  if (cart) {
    //declare variable
    let newlyInsertedCartItem;

    //call the product validator and pass in the meal details and the item quantity
    let validatedCartItem = cartItemValidation.validateCartItem(
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
    //return the newly inserted meal
    return newlyInsertedCartItem;
  }
  //if the cart those not exist
  else {
    //declare variable
    let newCart;
    //call the product validator and pass in the meal details and the item quantity
    let validatedCart = cartValidation.validateCart(cartItem);
    //if the validator validates the cartItem to database

    if (validatedCart != null) {
      newlyInsertedCart = await cartRepository.createNewCart(validatedCart);
    } else {
      //validation for product failed
      newlyInsertedCart = { error: "invalid cartItem" };

      //log the result
      console.log("cartService.createCart(): form validation failed");
    }
    return newCart;
  }
};

// return all the cart items
let getCart = async () => {
  const cart = await cartRepository.getCart();
  return cart;
};

//exports
module.exports = { addItemToCart, getCart };
