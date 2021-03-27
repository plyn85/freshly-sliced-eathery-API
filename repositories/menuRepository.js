//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

//models

const Meal = require("../models/meals.js");

// Get all meals from the meals table
// for json path - Tell MS SQL to return results as JSON (avoiding the need to convert here)
const SQL_SELECT_ALL =
  "SELECT * FROM dbo.meals ORDER BY _id ASC for json path;";
// returns inserted identity by menu_id = = SCOPE_IDENTITY()
const SQL_INSERT =
  "INSERT INTO dbo.meals (meal_name, meal_description, meal_price) VALUES (@mealName, @mealDescription,@mealPrice); SELECT * from dbo.meals WHERE _id = SCOPE_IDENTITY();";

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
      .query(SQL_SELECT_ALL);

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
  console.log(" product repo: ", meal);
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
      .query(SQL_INSERT);
    //the newly inserted product is returned by the query
    insertedMeal = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error inserting a new meal: ", err.message);
  }
  return insertedMeal;
};

//exports
module.exports = {
  getMenu,
  createMeal,
};
