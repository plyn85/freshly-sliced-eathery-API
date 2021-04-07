//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const baseValidators = require("../validators/baseValidators");
const menuRepository = require("../repositories/menuRepository");
const Cart = require("../models/cart");

//add a new cart item to the cart
let addItemToCart = async (cartItem) => {
  //constants and variables
  let cart;
  let cartId;
  let newlyInsertedCartItem;
  let validatedCartItem;
  let cartItemExists = false;
  //get the id from the incoming request
  //
  const meal_id = cartItem._id;

  //get a single meal by id and match with the meal id from the request body as the paramter
  //
  const mealDetails = await menuRepository.getMealById(meal_id);
  //
  // call the cart repo to check if exists
  cart = await cartRepository.getCart();
  //
  //if the cart does not exist
  if (cart == null) {
    //
    //create new cart with no zero as values  until item is added
    cart = new Cart(0, 0, 0);

    //
    //add to the database
    let { newCart } = await cartRepository.createNewCart(cart);
    console.log(newCart);
    //
    //now create the cartItem //call the product validator and pass in the meal details and the item quantity and the cart
    //
    validatedCartItem = cartItemValidation.validateCartItem(
      mealDetails,
      cartItem,
      newCart
    );
    //
    // if the validation is a success
    if (validatedCartItem != null) {
      // add the cartItem to the db
      newlyInsertedCartItem = await cartRepository.addItemToCart(
        validatedCartItem
      );
    } else {
      //validation for cartItem failed
      newlyInsertedCartItem = { error: "invalid cartItem" };
    }
    //then update the cart with the new total from the newly inserted cart item
    //
    //calculate the total
    subTotal = newlyInsertedCartItem.total * newlyInsertedCartItem.quantity;
    //get the id of new cart that was created
    cartId = newCart._id;
    const updateCartSubTotal = await cartRepository.updateCartSubTotal(
      cartId,
      subTotal
    );
  }
  //if the cart already exists
  else {
    //call the cart items
    const cartItems = await cartRepository.getAllCartItems();
    //check if there any items
    if (cartItems != null) {
      //loop through the items if there are
      cartItems.forEach((item) => {
        //if the item id matches the incoming req body id
        if (item.meal_id == mealDetails._id) {
          //then the cartItem already exists
          cartItemExists = true;
        }
      });
      console.log(cartItemExists);
    }
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
        //increase the Subtotal in the cart form the newly inserted cartItem

        //calculate the new subTotal
        let totalSuccessFullyUpdated = false;
        console.log(subTotal, "+ newSubTotal");
        let newSubTotal =
          newlyInsertedCartItem.quantity * newlyInsertedCartItem.price +
          console.log(
            newlyInsertedCartItem.quantity,
            newlyInsertedCartItem.price
          );
        //validate the total
        let validatedTotal = baseValidators.validatePrice(newSubTotal);
        //if validation returns true
        if (validatedTotal) {
          console.log(validatedTotal, "val total");
          //add it and update the cart
          totalSuccessFullyUpdated = await cartRepository.updateCartSubTotal(
            newSubTotal,
            cart[0]._id
          );
          console.log(totalSuccessFullyUpdated);
        } else {
          //validation for cartItem failed
          console.log("new sub total to db failed addItemToCart");
        }
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
  //check if there are any cart Items
  if (cartItems != null) {
    //loop through the cartItem and if an items quantity is zero delete it
    cartItems.forEach((item) => {
      if (item.quantity <= 0) {
        cartRepository.deleteCartItem(item._id);
      }
    });
    return cartItems;
  }
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
  // variables and const
  let updatedQtyOfMeal;

  //increase the quantity by one from the request meal body
  let updateQty = meal.quantity + 1;
  let mealId = meal._id;

  //validate
  let validatedQty = baseValidators.validatePositiveNumber(updateQty);
  let validatedMealId = baseValidators.validateId(mealId);

  // If validation returned  true - save to database
  if (validatedMealId && validatedQty) {
    updatedQtyOfMeal = await cartRepository.increaseQty(updateQty, mealId);
  } else {
    // Product data failed validation
    updatedQtyOfMeal = { error: "Qty update failed" };
  }
  // return the newly inserted product
  return updatedQtyOfMeal;
};

module.exports = {
  addItemToCart,
  getAllCartItems,
  deleteCartItem,
  deleteCart,
  increaseQty,
};
