//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const cartValidation = require("../validators/cartValidation");
const baseValidators = require("../validators/baseValidators");
//add a new cart item to the cart
let addItemToCart = async (mealDetails, cartItem) => {
  //constants and variables
  let newCart;
  let cart;
  //call the cart repo to check if a cart exists
  cart = await cartRepository.getCart();
  console.log("cart before cart created", cart);
  //if the cart does not exist
  if (cart == null) {
    //constants and variables

    console.log("cart does not exist");
    //declare variable
    //call the cart validator and pass in the meal details and the item quantity
    const validatedCart = cartValidation.validateCart(mealDetails, cartItem);
    //if the validator validates the cart add to database
    if (validatedCart != null) {
      newCart = await cartRepository.createNewCart(validatedCart);
    } else {
      //validation for cart failed
      newCart = { error: "invalid cart or cartItem" };

      //log the result
      console.log("cartService.createCart(): form validation failed");
    }
    console.log("New cart successfully created :", newCart);
  }
  //call the cart repo to check if a cart exists again after cart creation
  cart = await cartRepository.getCart();
  console.log("cart after cartCreated", cart);
  //if the cart exists
  if (cart != null) {
    //declare variable
    let newlyInsertedCartItem;

    //call the product validator and pass in the meal details and the item quantity and the cart
    let validatedCartItem = cartItemValidation.validateCartItem(
      mealDetails,
      cartItem,
      cart
    );
    //if the validator validates add the cartItem to database

    if (validatedCartItem != null) {
      newlyInsertedCartItem = await cartRepository.addItemToCart(
        validatedCartItem
      );
    } else {
      //validation for cartItem failed
      newlyInsertedCartItem = { error: "invalid cartItem" };
    }

    return newlyInsertedCartItem;
  }
};

// use later for update cart
// let subTotal = 0;
// //call all the cartItems once a new item has been inserted
// const cartItems = await cartRepository.getAllCartItems();
// // loop trough the cartItems calculating the subTotal
// for (let item of cartItems) {
//   subTotal += item.quantity * item.price;
// }
// console.log(subTotal, "subTotal");
// return all the cart items
let getAllCartItems = async () => {
  const cartItems = await cartRepository.getAllCartItems();
  return cartItems;
};

//delete a cartItem by id
let deleteCartItem = async (cartItemId) => {
  let deleteResult = false;
  //validate the input by call the id function form the base validators
  if (!baseValidators.validateId(cartItemId)) {
    console.log("deleteCartItem service error: invalid id parameter");
    return false;
  }
  //delete cartItem by id
  deleteResult = await cartRepository.deleteCartItem(cartItemId);
  // console.log(deleteResult, "meal service");

  return deleteResult;
};

//delete a cartItem by id
let deleteCart = async (cartId) => {
  let deleteResult = false;
  //validate the input by call the id function form the base validators
  if (!baseValidators.validateId(cartId)) {
    console.log("deleteCartItem service error: invalid id parameter");
    return false;
  }
  //delete cart by id
  deleteResult = await cartRepository.deleteCart(cartId);
  // console.log(deleteResult, "meal service");

  return deleteResult;
};

//exports
module.exports = { addItemToCart, getAllCartItems, deleteCartItem, deleteCart };
