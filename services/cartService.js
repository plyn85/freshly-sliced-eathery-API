//imports
const cartRepository = require("../repositories/cartRepository");
const cartItemValidation = require("../validators/cartItemValidation");

const baseValidators = require("../validators/baseValidators");
const menuRepository = require("../repositories/menuRepository");
const validator = require("validator");

const Cart = require("../models/cart");
const CartItem = require("../models/cartItems");



//
//add a new cart item to the cart
let addItemToCart = async (meal) => {
  //constants and variables
  let newlyInsertedCartItem;
  let insertedCartItem;
  //let mealDetails;
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
  let userId = meal.user_id;
  let validatedUserId;
  //validate the user id
  let validateUserId = baseValidators.validatePositiveNumber(userId);
  //if validation passes
  if (validateUserId) {
    validatedUserId = userId;
  }

  const mealDetails = await menuRepository.getMealById(meal._id);
  //the cart does not exist
  /* if the cart does not exist first a cart will be created 
  then a cartItem will be created and the FK of the cartItem 
  using the total form the new cartItem 
  will be set to match the PK of the cart. Finally the cart subtotal is updated
  */

  //if this is a new user the user id will be 0
  if (validatedUserId == 0) {
    //
    //create new cart and add to the database
    newCart = await cartRepository.createNewCart(new Cart());
    //if cart is created successfully set to true
    if (newCart != null) {
      newCartCreated = true;
    } else {
      console.log("cart was not created");
    }
    //
    //
    //calculate the total to he passed in cart item validation

    total = mealDetails.meal_price * meal.quantity;
    //
    //validate cart item and create instance add the id of the new cart as the cartItems FK
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
    //update the subtotal in the db
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

    //if all 3 return true return cart user id back to the cartController
    if (newCartCreated & firstCartItemInserted && newCartUpdated) {
      //query the user id from the newly created cart passing in the new cart id
      let userCartId = await cartRepository.getCartUserId(newCart._id);
      //return the unique user id  to front end of application
      return userCartId;
    }
    return false;
  }
  //
  /* if the cart exists  a cartItem will be created and the FK of the cartItem 
     will be set to match the PK of the cart. Finally the cart subtotal is updated
     using the total form the new cartItem 
  */
  else {
    console.log("cart exists");
    //get the cart of the current user by passing in the userId
    let currentUserCart = await getCartByUserId(validatedUserId);
    //console.log(currentUserCart._id);
    //call the cart items repo to check if there are any items
    const cartItems = await cartRepository.getAllCartItems();
    //console.log(cartItems);
    //
    //check if there any items
    if (cartItems != null) {
      //
      //loop trough the cart items returning true
      //if the cartItems id matched the mealDetails id
      // and the items cart id matches current users cart id
      cartItems.forEach((item) => {
        if (
          item.meal_id == mealDetails._id &&
          item.cart_id == currentUserCart._id
        ) {
          cartItemExists = true;
        }
      });
      //console.log(cartItemExists);
      //if the cartItem does not already exist prevents adding duplicates
      if (!cartItemExists) {
        // calculate the total for cart Item
        total = mealDetails.meal_price * meal.quantity;
        //

        // validate the cart item and create new instance
        validatedCartItem = cartItemValidation.validateCartItem(
          mealDetails,
          meal,
          currentUserCart._id,
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
          // //calculate the subTotal by looping through the items

          cartItems.forEach((item) => {
            //find items for current user
            if (item.cart_id == currentUserCart._id) {
              if (cartItems.length == 1) {
                //if cart only has one item
                //add the total to the subTotal
                subTotal += item.total;
              }
              //if it has more than one item loop through them calculate the total and add
              // to the subTotal
              else {
                subTotal += item.quantity * item.price;
              }
            }
          });
          //when loop is finished add the newly inserted cartItem total to
          //the subTotal
          subTotal += insertedCartItem.total;
          //console.log("cart subTotal :", subTotal);
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
        //if cartItem does not exists  return cartItemsExists variable
        //which and set to false
        return !cartItemExists;
      }
    }
    //if 2 return true then return true back to the cartController
    if (cartItemInserted && cartUpdated) {
      return true;
    }
  }
};

// to get the cart user id
let getCartByUserId = async (userId) => {
  let cart;
  //check the string in not empty and contains the correct number of chars
  let validateId = baseValidators.validatePositiveNumber(userId);
  //if true
  if (validateId) {
    //before passing the db
    cart = await cartRepository.getCartByUserId(userId);
  } else {
    console.log("validationFailed  getCartByUserId");
  }
  //return cartItems
  return cart;
};
// to get all cartItems
let getAllCartItems = async (userId) => {
  //create and empty array
  let arr = [];
  //if the user id is zero no items have been added to
  //a cart so let the array return empty

  //get current cart
  let currentCart = await getCartByUserId(userId);
  //if there are no items in the current cart return zero
  if (currentCart == null) {
    return 0;
  }
  //else return the items
  else {
    //get cartItems from db
    const cartItems = await cartRepository.getAllCartItems();
    //loop through the cartItems
    cartItems.forEach((item) => {
      //match the cartItems cartId to current cart cartId
      if (item.cart_id == currentCart._id) {
        arr.push(item);
      }
    });
  }
  //return the array of items
  return arr;
};
//delete a cartItem by id
let deleteCartItem = async (cartItemId, userId) => {
  //constants and variables
  let deleteResult = false;
  let subTotal = 0;
  let currentCartSubTotal = 0;
  let deletedItemPrice = 0;
  //validated the inputs and if it returns true
  if (
    baseValidators.validateId(cartItemId) &&
    baseValidators.validatePositiveNumber(userId)
  ) {
    //get the item price before its deleted
    //first get the current users cart
    const currentUserCart = await getCartByUserId(userId);
    //console.log("currentuserCart", currentUserCart);
    //then get all the cartItems
    const cartItems = await cartRepository.getAllCartItems();
    //console.log("ci", cartItems);
    //if the cartItems are returned from db
    if (cartItems != null) {
      //  console.log("cart items returned from db success");
      //loop through the items
      cartItems.forEach((item) => {
        // console.log("item total : ", item.total);
        //if the id of the item matches an id in the db
        //and the cart item id matches the current users cart id
        if (item._id == cartItemId && item.cart_id && currentUserCart._id) {
          //console.log("item", item);
          //store the item to be deleted price
          deletedItemPrice = item.total;
        }
      });
    } else {
      console.log("cart items returned form db failed");
    }
    //delete cartItem by id
    deleteResult = await cartRepository.deleteCartItem(cartItemId);
    //if the delete was successful
    if (deleteResult) {
      console.log("item was successfully deleted from db");

      //get the current cart
      const cart = await cartRepository.getCartByUserId(userId);
      //console.log(cart);
      //if the cart is returned from db
      if (cart != null) {
        console.log("cart successfully returned form db", cart);
        //get the subTotal of the current cart
        currentCartSubTotal = cart.subtotal;
        // console.log("del item price", deletedItemPrice);
        //calculate the new subTotal
        subTotal = currentCartSubTotal - deletedItemPrice;
        // console.log("subtotal", subTotal);
        //update the subTotal of the cart passing in cartId and the new subTotal
        const updatedCart = await cartRepository.updateCartSubTotal(
          cart._id,
          subTotal
        );
        //if the updated subTotal is a success
        if (updatedCart) {
          console.log("cart update subTotal success deleteItem", updatedCart);
          //get the current cart
          const cart = await cartRepository.getCartByUserId(userId);
          //check to see if the cart subTotal is zero

          //console.log("cart", cart);
          if (cart.subtotal <= 0) {
            //delete the cart if it is
            const deleteCart = await cartRepository.deleteCart(cart._id);
            if (deleteCart) {
              console.log("cart deleted");
              //return zero to the app if the cart was deleted;
              return 0;
            } else {
              console.log("cart deletion failed");
            }
          }
        } else {
          console.log("cart update subTotal fail deleteItem");
        }
      }
    } else {
      console.log("item deleted from db failed");
    }
  } else {
    // console.log(deleteResult, "meal service");
    console.log("deleteCartItem service error: invalid id parameter");
    return false;
  }

  return true;
};

//delete the entire cart
let deleteCart = async (cartId) => {
  let deleteResult = false;
  //validate the input by call the id function form the base validators
  if (!baseValidators.validateId(cartId)) {
    console.log("deleteCartItem service error: invalid id parameter");
    return false;
  }
  //delete cart by id
  deleteResult = await cartRepository.deleteCart(cartId);
  return deleteResult;
};

//change the quantity of cartItem
let changeQty = async (mealData) => {
  //constants and variables
  let total = 0;
  let subTotal = 0;
  let mealId = mealData._id;
  let validatedMeal;
  let quantity = mealData.quantity;
  let cartItemId = 0;
  let cartId = 0;
  //validate the meal id and quantity
  console.log("meal id", mealId);
  validatedMeal = baseValidators.validatePositiveNumber(mealId);
  // quantity = baseValidators.validatePositiveNumber(quantity);

  // if validation is successful
  //
  if (validatedMeal) {
    //console.log("mealid validated");
    //get meal form db
    //
    const mealToUpdate = await menuRepository.getMealById(mealId);

    //if the meal is returned from the db
    //
    if (mealToUpdate != null) {
      //first get the current users cart
      const currentUserCart = await cartRepository.getCartByUserId(
        mealData.user_id
      );
      console.log(currentUserCart);
      //then get the cart items
      const cartItems = await cartRepository.getAllCartItems();

      //if the cart items are returned from the db
      if (cartItems != null) {
        //loop through the cartItems
        //
        cartItems.forEach((item) => {
          // matching the meal form the db with cartItem meal from the db
          if (
            mealToUpdate._id == item.meal_id &&
            item.cart_id == currentUserCart._id
          ) {
            //calculate the total to be added to the updated item
            total = mealData.quantity * item.price;
            //get the id of cart Item
            cartItemId = item._id;
          }
        });

        //update the quantity and the total of cartItem in the db using the cartItems id
        //
        const updatedCartItem = await cartRepository.changeQty(
          quantity,
          cartItemId,
          total
        );
        //if update returns successfully
        //
        if (updatedCartItem != null) {
          console.log(
            "cartItem update qty and total success :"
            // updatedCartItem
          );

          //
          //get the cart items after update
          const cartItems = await cartRepository.getAllCartItems();

          //if the cart is successfully returned from db
          if (cartItems != null) {
            console.log("cartItems returned success");
          } else {
            console.log("cartItems not returned form db");
          }

          //
          // //loop through the cart Items
          for (let i = 0; i < cartItems.length; i++) {
            //constants and variables
            let item = cartItems[i];
            let itemTotal = item.total;
            // if the quantity of an item is zero and the id matches the updated item delete
            //and if the item matches the item from the current users cart
            if (
              item.quantity <= 0 &&
              updatedCartItem._id == item._id &&
              item.cart_id == currentUserCart._id
            ) {
              const cartItemDeleted = await cartRepository.deleteCartItem(
                item._id
              );
              //if the cartItem has beed deleted
              if (cartItemDeleted) {
                console.log("cartItem has been deleted changeQty");
                //delete the item total form before it was deleted form subTotal;
                subTotal -= itemTotal;
              }
            }
            //if the items cart id match the current users cartId
            if (item.cart_id == currentUserCart._id) {
              subTotal += item.total;
              console.log(subTotal);
              //get the cartId of the items
              cartId = item.cart_id;
            }
          }
          //if the current users cart subTotal is zero delete the cart
          //if the subtotal is zero delete the cart
          if (subTotal == 0) {
            //delete cart
            const deleteCart = await cartRepository.deleteCart(
              updatedCartItem.cart_id
            );
            //if cart is deleted
            if (deleteCart) {
              console.log("cartDeleted", deleteCart);
              //return true to the frontend of application
              return deleteCart;
            } else {
              console.log("cart delete fail :", deleteCart);
            }
          } else {
            //then update the cart with the new subTotal
            let updatedSubTotal = await cartRepository.updateCartSubTotal(
              cartId,
              subTotal
            );
            //if the updated subTotal returns form db
            if (updatedSubTotal) {
              console.log("updated subTotal success", updatedSubTotal);
              //return updatedSubTotal;
            }
          }
        }
      } else {
        console.log("cartItems returned form db fail");
      }
    } else {
      console.log("meal returned form db failed");
    }
  } else {
    console.log("meal id or quantity validation fail");
  }
};


//exports
module.exports = {
  addItemToCart,
  getAllCartItems,
  deleteCartItem,
  deleteCart,
  changeQty,
  getCartByUserId,

};
