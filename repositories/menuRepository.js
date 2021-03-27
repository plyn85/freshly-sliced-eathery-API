//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

//models

const Meal = require("../models/meals.js");

// Get all products from the meals table
// for json path - Tell MS SQL to return results as JSON (avoiding the need to convert here)
const SQL_SELECT_ALL =
  "SELECT * FROM dbo.meals ORDER BY _id ASC for json path;";

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
  return `${meal}`;
};
//exports
module.exports = {
  getMenu,
  createMeal,
};
