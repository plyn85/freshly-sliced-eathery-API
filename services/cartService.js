//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const cartValidation = require("../validators/cartValidation");
const baseValidators = require("../validators/baseValidators");
const menuRepository = require("../repositories/menuRepository");
//add a new cart item to the cart
let addItemToCart = async (cartItem) => {
  //constants and variables
  let newCart;
  let cart;
  let newlyInsertedCartItem;
  let validatedCartItem;
  let cartItemExists = false;

  //get the id from the incoming request
  const meal_id = cartItem._id;
  //get a single meal by id and match with the meal id from the request body as the paramter
  const mealDetails = await menuRepository.getMealById(meal_id);
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
    //call the cart items
    const cartItems = await cartRepository.getAllCartItems();
    //loop through the items
    cartItems.forEach((item) => {
      //if the item id matches the incoming req body id
      if (item.meal_id == mealDetails._id) {
        cartItemExists = true;
      }
    });
    console.log(cartItemExists);
    //check if cartItem already exists in cart to prevent adding duplicates
    if (!cartItemExists) {
      //call the product validator and pass in the meal details and the item quantity and the cart
      validatedCartItem = cartItemValidation.validateCartItem(
        mealDetails,
        cartItem,
        cart
      );

      if (validatedCartItem != null) {
        newlyInsertedCartItem = await cartRepository.addItemToCart(
          validatedCartItem
        );
      } else {
        //validation for cartItem failed
        newlyInsertedCartItem = { error: "invalid cartItem" };
      }
      return newlyInsertedCartItem;
    } else {
      console.log("cartItem already exists in cart");
    }
  }
};

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

//increase quantity of cartItem
let increaseQty = async (meal) => {
  //variables
  let incQtyItem;
  let mealId = meal._id;
  //call all the cartItems
  const cartItems = await cartRepository.getAllCartItems();
  cartItems.forEach((item) => {
    console.log(item.meal_id, mealDetails._id, "inItem");
    //check if the item exists in the cart and if it does remove it
    if (item.meal_id == mealDetails._id && item.quantity <= 0) {
      console.log(item, "item to remove");
    }
  });
  //  loop trough the cartItems calculating the subTotal
  for (let item of cartItems) {
    console.log(item._id, mealId);
    if (mealId == item._id) {
      item.quantity++;
      subTotal += item.quantity * item.price;
    }
  }
  console.log(subTotal, "subTotal");

  // let validatedIncQtyItem = increaseQtyValidators(itemInfo);
  // // If validation returned a product object - save to database
  // if (validatedIncQtyItem != null) {
  //   incQtyItem = await categoriesRepository.increaseQty(validatedIncQtyItem);
  // } else {
  //   // Product data failed validation
  //   incQtyItem = { error: "increase quantity update failed" };
  //   // debug info
  //   console.log("CategoryService.increaseQty(): form data validate failed");
  // }
  // console.log("inc quantity category service :", incQtyItem);
  // // return the newly inserted category
  return incQtyItem;
};

module.exports = {
  addItemToCart,
  getAllCartItems,
  deleteCartItem,
  deleteCart,
  increaseQty,
};
