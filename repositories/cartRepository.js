//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

//all sql statement in this object;
const sqlStatements = {
  //select all and order by id
  SQL_SELECT_ALL: "SELECT * FROM dbo.cart ORDER BY _id ASC for json path;",
  // insert a meal to db
  SQL_INSERT:
    "INSERT INTO dbo.cartItems (meal_id,quantity,price,total) VALUES (@mealId,@cartItemQuantity, @cartItemPrice,@cartItemTotal); SELECT * from dbo.cartItems WHERE _id = SCOPE_IDENTITY();",
  // get a single meal by it id
  SQL_SELECT_BY_ID:
    "SELECT * FROM dbo.meals WHERE _id = @id  for json path, without_array_wrapper;",
  // delete a meal by its id
  SQL_DELETE: "DELETE FROM dbo.meals WHERE _id = @id;",
};

// insert a meal to the db
let addItemToCart = async (cartItem) => {
  //   console.log(" product repo: ", meal);
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
      .input("mealId", sql.Int, cartItem.meal_id)
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
      .query(sqlStatements.SQL_SELECT_ALL);

    // first element of the recordset holds products
    cart = result.recordset[0];

    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - get cart: ", err.message);
  }

  // return products
  return cart;
};
//exports
module.exports = { addItemToCart, getCart };
