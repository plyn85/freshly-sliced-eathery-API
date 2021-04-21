//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

//all sql statement in this object;
const sqlStatements = {
  //select all cartItems
  SQL_SELECT_ALL_CART_ITEMS:
    "SELECT * FROM dbo.cartItems ORDER BY _id ASC for json path;",
  //select all from the cart
  SQL_SELECT_ALL_FROM_CART:
    "SELECT * FROM dbo.cart ORDER BY _id ASC for json path;",
  // insert a meal to db
  SQL_INSERT:
    "INSERT INTO dbo.cartItems (cart_id,meal_id,meal_name,meal_description,quantity,price,total) VALUES (@cartId,@mealId,@mealName,@mealDescription,@cartItemQuantity, @cartItemPrice,@cartItemTotal); SELECT * from dbo.cartItems WHERE _id = SCOPE_IDENTITY();",
  //create a new cart in the db
  SQL_INSERT_NEW_CART:
    "INSERT INTO dbo.cart (user_id,subtotal) VALUES (@userId,@subTotal) SELECT * from dbo.cart WHERE _id = SCOPE_IDENTITY();",
  // get a single meal by it id
  SQL_SELECT_BY_ID:
    "SELECT * FROM dbo.meals WHERE _id = @id  for json path, without_array_wrapper;",
  // delete a meal by its id
  SQL_DELETE_CART_ITEM: "DELETE FROM dbo.cartItems WHERE _id = @id;",
  //delete cart by its id
  SQL_DELETE_CART: "DELETE FROM dbo.cart WHERE _id = @id;",
  SQL_UPDATE_CART_ITEM_QTY:
    "UPDATE dbo.cartItems SET quantity = @quantity , total = @total WHERE _id = @id; SELECT * FROM dbo.cartItems WHERE _id = @id;",
  SQL_UPDATE_CART_SUB_TOTAL:
    "UPDATE dbo.cart SET subTotal = @subTotal WHERE _id = @id; SELECT * FROM dbo.cart WHERE _id = @id;",
  SQL_INSERT_CUSTOMER:
    "INSERT INTO dbo.customer (name,email,message,collection_time) VALUES (@name,@email,@collectionTime,@message) SELECT * from dbo.customer WHERE _id = SCOPE_IDENTITY();",
};

// insert a meal to the db
let addItemToCart = async (cartItem) => {
  //console.log("cartItems", cartItem);
  //   Declare variables
  let insertedCartItem;
  //insert new cartItem
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("cartId", sql.Int, cartItem.cart_id)
      .input("mealId", sql.Int, cartItem.meal_id)
      .input("mealName", sql.NVarChar, cartItem.meal_name)
      .input("mealDescription", sql.NVarChar, cartItem.meal_description)
      .input("cartItemQuantity", sql.Int, cartItem.quantity)
      .input("cartItemPrice", sql.Decimal, cartItem.price)
      .input("cartItemTotal", sql.Decimal, cartItem.total)
      //execute query
      .query(sqlStatements.SQL_INSERT);
    //the newly inserted product is returned by the query
    insertedCartItem = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error inserting a new cartItem: ", err.message);
  }
  return insertedCartItem;
};

//create a cart
let createNewCart = async (cart) => {
  //   Declare variables
  let newCart;
  //insert new cart
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("userId", sql.Int, cart.user_id)
      .input("subtotal", sql.Int, cart.subtotal)
      //execute query
      .query(sqlStatements.SQL_INSERT_NEW_CART);
    //the newly inserted product is returned by the query
    newCart = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error inserting a new cart: ", err.message);
  }

  return newCart;
};
// Get all the cart items
let getAllCartItems = async () => {
  // define variable
  let cartItems;
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      .query(sqlStatements.SQL_SELECT_ALL_CART_ITEMS);
    cartItems = result.recordset[0];

    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - get cartItems: ", err.message);
  }

  // return products
  return cartItems;
};

// Get all the cart items
let getCart = async () => {
  // define variable to store the cart
  let cart;

  // Get a DB connection and execute SQL (uses imported database module)
  // Note await in try/catch block
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // execute the select all query (defined above)
      .query(sqlStatements.SQL_SELECT_ALL_FROM_CART);

    // first element of the recordset holds cart
    cart = result.recordset[0];

    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - get cart: ", err.message);
  }

  // return all cartItems
  return cart;
};

// delete a single meal by its id
let deleteCartItem = async (cartItemId) => {
  let rowsAffected = 0;

  // returns a single product with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, cartItemId)
      // execute query
      .query(sqlStatements.SQL_DELETE_CART_ITEM);
    //Was the product deleted?
    rowsAffected = Number(result.rowsAffected);
  } catch (err) {
    console.log("DB Error - deleteCartItem by id: ", err.message);
  }
  // if noting is deleted
  if (rowsAffected === 0) {
    return false;
  } else {
    return true;
  }
};

// delete a single meal by its id
let deleteCart = async (cartId) => {
  let rowsAffected = 0;

  // returns a single product with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, cartId)
      // execute query
      .query(sqlStatements.SQL_DELETE_CART);
    //Was the product deleted?
    rowsAffected = Number(result.rowsAffected);
    console.log(rowsAffected);
  } catch (err) {
    console.log("DB Error - deleteCartItem by id: ", err.message);
  }
  // if noting is deleted
  if (rowsAffected === 0) {
    return false;
  } else {
    return true;
  }
};

//update the of cart Item quantity in the db
let changeQty = async (updateQty, mealId, total) => {
  console.log(updateQty, mealId, total);
  //Declare variables
  let updatedQty;

  //insert the updated quantity
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, mealId)
      .input("quantity", sql.Int, updateQty)
      .input("total", sql.Decimal, total)
      .query(sqlStatements.SQL_UPDATE_CART_ITEM_QTY);
    //the newly inserted product is returned by the query
    updatedQty = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error updating a quantity: ", err.message);
  }
  return updatedQty;
};

//update the subTotal of cart
let updateCartSubTotal = async (cartId, subTotal) => {
  console.log("subTotal repo", subTotal);
  //Declare variables
  let rowsAffected = 0;
  //insert the updated quantity
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, cartId)
      .input("subTotal", sql.Int, subTotal)
      .query(sqlStatements.SQL_UPDATE_CART_SUB_TOTAL);
    //the newly inserted product is returned by the query
    rowsAffected = Number(result.rowsAffected);
  } catch (err) {
    console.log("DB Error - error updating a subTotal: ", err.message);
  }
  if (rowsAffected === 0) {
    return false;
  } else {
    return true;
  }
};

//create an order in db
let createCustomer = async (customerData) => {
  console.log(customerData);
  //   Declare variables
  let customer;
  //insert new customer
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("name", sql.NVarChar, customerData.name)
      .input("email", sql.NVarChar, customerData.email)
      .input("message", sql.NVarChar, customerData.message)
      .input("collectionTime", sql.NVarChar, customerData.collection_time)
      //execute query
      .query(sqlStatements.SQL_INSERT_CUSTOMER);
    //the newly inserted order is returned by the query
    customer = result.recordset[0];
    console.log(customer);
  } catch (err) {
    console.log("DB Error - error inserting a new order: ", err.message);
  }
  return customer;
};
//
//
//exports
module.exports = {
  addItemToCart,
  getAllCartItems,
  createNewCart,
  getCart,
  deleteCartItem,
  deleteCart,
  changeQty,
  updateCartSubTotal,
  createCustomer,
};
