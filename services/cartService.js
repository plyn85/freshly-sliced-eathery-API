//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");
const baseValidators = require("../validators/baseValidators");
const menuRepository = require("../repositories/menuRepository");
const Cart = require("../models/cart");
//
//add a new cart item to the cart
let addItemToCart = async (meal) => {
  //constants and variables
  let cart;
  let newlyInsertedCartItem;
  let insertedCartItem;
  let mealDetails;
  let validatedCartItem;
  let newCart;
  let updateCartSubTotal;
  let newCartCreated = false;
  let firstCartItemInserted = false;
  let cartItemInserted = false;
  let newCartUpdated = false;
  let cartUpdated = false;
  let cartItemExists = false;
  let total = 0;
  let subTotal = 0;

  mealDetails = await menuRepository.getMealById(meal._id);

  //
  // call the cart repo to check if exists
  cart = await cartRepository.getCart();
  //
  /* if the cart does not exist first a cart will be created 
     then a cartItem will be created and the FK of the cartItem 
     will be set to match the PK of the cart. Finally the cart subtotal is updated
     using the total form the new cartItem 
  */
  if (cart == null) {
    console.log("cart does not exist");
    //
    //create new cart instance with zero as values  until item is added
    cart = new Cart(0, 0, 0);

    //
    //add new cart to the database
    newCart = await cartRepository.createNewCart(cart);
    //if cart is created successfully log to console
    if (newCart != null) {
      console.log("New cart created", newCart);
      newCartCreated = true;
    } else {
      console.log("cart was not created");
    }
    //
    //
    //calculate the total to he passed in cart item validation

    total = mealDetails.meal_price * meal.quantity;
    //
    //validate cart item and create instance
    validatedCartItem = cartItemValidation.validateCartItem(
      mealDetails,
      meal,
      newCart._id,
      total
    );
    //
    // if the validation is a success
    if (validatedCartItem != null) {
      //
      // add the cartItem to the db
      newlyInsertedCartItem = await cartRepository.addItemToCart(
        validatedCartItem
      );
      if (newlyInsertedCartItem != null) {
        firstCartItemInserted = true;
        //log newly inserted cartItem
        console.log(newlyInsertedCartItem, "First cart Item inserted success");
      } else {
        console.log("first cartItem not inserted");
      }
    } else {
      //
      //validation for cartItem failed
      newlyInsertedCartItem = { error: "invalid cartItem" };
    }
    //then update the cart with the new total from the newly inserted cart item
    //
    //calculate the total
    subTotal = newlyInsertedCartItem.total * newlyInsertedCartItem.quantity;
    //
    console.log(subTotal);
    //and add to the db using the new cart id as the new cartItems FK
    const updateCartSubTotal = await cartRepository.updateCartSubTotal(
      newCart._id,
      subTotal
    );
    if (updateCartSubTotal != null) {
      newCartUpdated = true;
      console.log(
        "cart total update success after first item added:",
        updateCartSubTotal
      );
    } else {
      console.log("cart update failed");
    }
    //if all 3 return true return true back to the cartController
    if (newCartCreated & firstCartItemInserted && newCartUpdated) {
      return true;
    }
  }
  //
  /* if the cart exists  a cartItem will be created and the FK of the cartItem 
     will be set to match the PK of the cart. Finally the cart subtotal is updated
     using the total form the new cartItem 
  */
  else {
    console.log("cart exists");
    //call the cart items repo to check if there are any items
    const cartItems = await cartRepository.getAllCartItems();
    //
    //check if there any items
    if (cartItems != null) {
      //
      //loop trough the cart items returning true if the cartItems id matched the mealDetails id
      cartItems.forEach((item) => {
        if (item.meal_id == mealDetails._id) cartItemExists = true;
      });

      //if the cartItem does not already exist prevents adding duplicates
      if (!cartItemExists) {
        // calculate the total for cart Item
        total = mealDetails.meal_price * meal.quantity;
        //

        // validate the cart item and create new instance
        validatedCartItem = cartItemValidation.validateCartItem(
          mealDetails,
          meal,
          cartItems[0].cart_id,
          total
        );
        // if the validation is a success
        if (validatedCartItem != null) {
          //add to the db
          insertedCartItem = await cartRepository.addItemToCart(
            validatedCartItem
          );
          //if the cart item is added to the db
          if (insertedCartItem != null) {
            cartItemInserted = true;
            console.log("cartItem successfully inserted");
          } else {
            console.log("cart item inserted failed");
          }
          // //calculate the subTotal by loop through the items
          cartItems.forEach((item) => {
            //if cart only has one item just add the total to the subTotal
            if (cartItems.length == 1) {
              subTotal += item.total;
            }
            //if it has more than one item loop through them calculate the total and add
            // to the subTotal
            else {
              subTotal += item.quantity * item.total;
            }
          });
          //when loop is finished add the newly inserted cartItem total to
          //the subTotal
          subTotal += insertedCartItem.total;
          console.log("cart subTotal :", subTotal);
          //
          //add the updated cart subTotal and match the FK of the cartItem
          //with the carts PK
          updateCartSubTotal = await cartRepository.updateCartSubTotal(
            insertedCartItem.cart_id,
            subTotal
          );
          //if the cart is updated in the db
          if (updateCartSubTotal != null) {
            cartUpdated = true;
            console.log("cart total update success");
          } else {
            console.log("cart updated fail");
          }
        } else {
          //validation for cartItem failed
          insertedCartItem = {
            error: "invalid cartItem or update subTotal",
          };
        }
      }
      //alert to the console if a duplicate item was added
      else {
        console.log("cartItem already exists in cart");
      }
    }
    //if 2 return true ten return true back to the cartController
    if (cartItemInserted && cartUpdated) {
      return true;
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
