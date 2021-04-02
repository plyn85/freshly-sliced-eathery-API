//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const cartValidation = require("../validators/cartValidation");
//add a new cart item to the cart
let addItemToCart = async (mealDetails, cartItem) => {
  //call the cart repo
  const cart = await cartRepository.getCart();
  //if the cart does not exist
  if (!cart) {
    console.log("cart those not exist");
    //declare variable
    let newCart;
    //call the product validator and pass in the meal details and the item quantity
    let validatedCart = cartValidation.validateCart(mealDetails, cartItem);
    //if the validator validates the cartItem to database

    if (validatedCart != null) {
      newCart = await cartRepository.createNewCart(validatedCart);
    } else {
      //validation for product failed
      newCart = { error: "invalid cartItem" };

      //log the result
      console.log("cartService.createCart(): form validation failed");
    }
    return newCart;
  }
  //if the cart exists
  else {
    const cartItems = await cartRepository.getAllCartItems();
    for (let i = 0; i < cartItems.length; i++) {
      console.log(cartItems[i], "cart cont items");
    }
    //declare variable
    let newlyInsertedCartItem;

    //call the product validator and pass in the meal details and the item quantity
    let validatedCartItem = cartItemValidation.validateCartItem(
      mealDetails,
      cartItem,
      cart[0]
    );
    //if the validator validates add the cartItem to database

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
    console.log(newlyInsertedCartItem);
    return newlyInsertedCartItem;
  }
};

// return all the cart items
let getAllCartItems = async () => {
  const cartItems = await cartRepository.getAllCartItems();
  return cartItems;
};

//exports
module.exports = { addItemToCart, getAllCartItems };
