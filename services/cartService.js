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
     using the total form the new cartItem 
     will be set to match the PK of the cart. Finally the cart subtotal is updated
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
  //get cartItems from db
  const cartItems = await cartRepository.getAllCartItems();
  //return cartItems
  return cartItems;
};

//delete a cartItem by id
let deleteCartItem = async (cartItemId) => {
  //constants and variables
  let deleteResult = false;
  let subTotal = 0;
  let currentCartSubTotal = 0;
  let deletedItemPrice = 0;
  //validate the input and if it returns true
  if (baseValidators.validateId(cartItemId)) {
    //get the item price before its deleted
    //first get the cart Items
    const cartItems = await getAllCartItems();
    console.log("cartItems :", cartItems);
    //if the cartItems are returned from db
    if (cartItems != null) {
      console.log("cart items returned from db success");
      //loop through the items
      cartItems.forEach((item) => {
        console.log("item total : ", item.total);
        //if the id of the item matches an id in the db
        if (item._id == cartItemId) {
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
      const cart = await cartRepository.getCart();
      //if the cart is returned from db
      if (cart != null) {
        console.log("cart successfully returned form db", cart[0]);
        //get the subTotal of the current cart
        currentCartSubTotal = cart[0].subtotal;
        console.log("del item price", deletedItemPrice);
        //calculate the new subTotal
        subTotal = currentCartSubTotal - deletedItemPrice;
        console.log("subtotal", subTotal);
        //update the subTotal of the cart passing in cartId and the new subTotal
        const updatedCart = await cartRepository.updateCartSubTotal(
          cart[0]._id,
          subTotal
        );
        //if the updated subTotal is a success
        if (updatedCart) {
          console.log("cart update subTotal success deleteItem", updatedCart);
          //get the current cart
          const cart = await cartRepository.getCart();
          //check to see if the cart subTotal is zero
          console.log(cart[0].subtotal);
          if (cart[0].subtotal <= 0) {
            //delete the cart if it is
            const deleteCart = cartRepository.deleteCart(cart[0]._id);
            //if the cart was deleted
            if (deleteCart) {
              console.log("cart deleted");
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
  return deleteResult;
};

//change the quantity of cartItem
let changeQty = async (meal) => {
  //constants and variables
  let total = 0;
  let subTotal = 0;
  let mealId = meal.meal_id;
  let validatedMeal;
  let quantity = meal.quantity;
  let cartItemId = 0;
  let cartId = 0;
  //validate the meal id and quantity
  validatedMeal = baseValidators.validatePositiveNumber(mealId);
  // quantity = baseValidators.validatePositiveNumber(quantity);

  // if validation is successful
  //
  if (validatedMeal) {
    console.log("mealid validated");
    //get meal form db
    //
    const mealToUpdate = await menuRepository.getMealById(mealId);
    //console.log(mealToUpdate);
    //if the meal is returned from the db
    //
    if (mealToUpdate != null) {
      //console.log("meal from db success :", mealToUpdate);
      //get the cartItems form the db
      const cartItems = await cartRepository.getAllCartItems();
      //if the cart items are returned from the db
      if (cartItems != null) {
        //console.log("cart from db success :", cartItems);
        //loop through the cartItems
        //
        cartItems.forEach((item) => {
          //console.log("item :", item);
          // matching the meal form the db with cartItem meal from the db
          if (mealToUpdate._id == item.meal_id) {
            // console.log(item, mealToUpdate._id, item.meal_id, "meal");
            //calculate the total to be added to the updated item
            total = meal.quantity * item.price;
            //get the id of cart Item
            cartItemId = item._id;
          } else {
            console.log("meal does not match with meal from cartItems");
          }
        });
        //console.log(cartItemId);
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
          // console.log("cartItems :", cartItems);
          //if the cart is successfully returned from db
          if (cartItems != null) {
            console.log("cartItems returned success");
          } else {
            console.log("cartItems not returned form db");
          }
          let itemPrice = 0;
          //
          // //loop through the cart Items
          cartItems.forEach((item) => {
            // if the quantity of an item is zero and the id matches the updated item delete
            if (item.quantity <= 0 && updatedCartItem._id == item._id) {
              const cartItemDeleted = cartRepository.deleteCartItem(item._id);
              //if the cartItem has beed deleted
              if (cartItemDeleted) {
                console.log("cartItem has been deleted changeQty");
                //change the subTotal to zero
                subTotal = 0;
              }
            } else {
              subTotal += item.total;
              //get the cartId of the items
              cartId = item.cart_id;
            }
          });
          //then update the cart with the new subTotal
          let updatedSubTotal = await cartRepository.updateCartSubTotal(
            cartId,
            subTotal
          );
          //if the updated subTotal returns form db
          if (updatedSubTotal) {
            console.log("updated subTotal success", updatedSubTotal);
            return updatedSubTotal;
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
module.exports = {
  addItemToCart,
  getAllCartItems,
  deleteCartItem,
  deleteCart,
  changeQty,
};
