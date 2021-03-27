//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

//models

const Meal = require("../models/meals.js");
//all sql statement in this object;
const sqlStatements = {
  //select all and order by id
  SQL_SELECT_ALL: "SELECT * FROM dbo.meals ORDER BY _id ASC for json path;",
  // insert a meal to db
  SQL_INSERT:
    "INSERT INTO dbo.meals (meal_name, meal_description, meal_price) VALUES (@mealName, @mealDescription,@mealPrice); SELECT * from dbo.meals WHERE _id = SCOPE_IDENTITY();",
  // get a single meal by it id
  SQL_SELECT_BY_ID:
    "SELECT * FROM dbo.meals WHERE _id = @id  for json path, without_array_wrapper;",
  // delete a meal by its id
  SQL_DELETE: "DELETE FROM dbo.meals WHERE _id = @id;",
};

// Get all the menu items
let getMenu = async () => {
  // define variable to store products
  let meals;

  // Get a DB connection and execute SQL (uses imported database module)
  // Note await in try/catch block
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // execute the select all query (defined above)
      .query(sqlStatements.SQL_SELECT_ALL);

    // first element of the recordset holds products
    meals = result.recordset[0];

    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - get all meals: ", err.message);
  }

  // return products
  return meals;
};

// insert a meal to the db
let createMeal = async (meal) => {
  // console.log(" product repo: ", meal);
  //Declare variables
  let insertedMeal;
  //insert new product
  try {
    //get a database connection and insert SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("mealName", sql.NVarChar, meal.meal_name)
      .input("mealDescription", sql.NVarChar, meal.meal_description)
      .input("mealPrice", sql.Decimal, meal.meal_price)
      //execute query
      .query(sqlStatements.SQL_INSERT);
    //the newly inserted product is returned by the query
    insertedMeal = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error inserting a new meal: ", err.message);
  }
  return insertedMeal;
};

// get a single meal by id
let getMealById = async (mealId) => {
  let meal;
  // console.log("repo meal id:", mealId);
  // returns a single meal with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, mealId)
      // execute query
      .query(sqlStatements.SQL_SELECT_BY_ID);

    // Send response with JSON result
    meal = result.recordset[0];
  } catch (err) {
    console.log("DB Error - get product by id: ", err.message);
  }
  // console.log("meal returned form db meal repo :", meal);
  // return the product
  return meal;
};

// delete a single meal by its id
let deleteMeal = async (mealId) => {
  let rowsAffected = 0;

  // returns a single product with matching id
  try {
    // Get a DB connection and execute SQL
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // set @id parameter in the query
      .input("id", sql.Int, mealId)
      // execute query
      .query(sqlStatements.SQL_DELETE);
    //Was the product deleted?
    rowsAffected = Number(result.rowsAffected);
    console.log(rowsAffected);
  } catch (err) {
    console.log("DB Error - get product by id: ", err.message);
  }
  // if noting is deleted
  if (rowsAffected === 0) {
    return false;
  } else {
    return true;
  }
};
//exports
module.exports = {
  getMenu,
  createMeal,
  getMealById,
  deleteMeal,
};
