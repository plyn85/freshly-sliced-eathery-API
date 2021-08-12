//require the database connection

const { json } = require("express");
const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

const sqlStatements = {
  SQL_INSERT_CUSTOMER:
    "INSERT INTO dbo.customer (name,email,address,delivery,collection,collection_delivery_time,message) VALUES (@name,@email,@address,@delivery,@collection,@collection_delivery_time,@message) SELECT * from dbo.customer WHERE _id = SCOPE_IDENTITY();",
  SQL_INSERT_CUSTOMER_AFTER_SIGN_UP:
    "INSERT INTO dbo.customer (name,email) VALUES (@name,@email) SELECT * from dbo.customer WHERE _id = SCOPE_IDENTITY();",
  SQL_FIND_BY_USER_EMAIL:
    "SELECT * FROM dbo.customer WHERE email  = @email for json path, without_array_wrapper;",
};

//create an order in db
let createCustomer = async (customerData) => {
  console.log("auth email", typeof customerData.email);
  //   Declare variables
  let customer;

  //insert new customer
  try {
    //get a database connection and insert SQLs
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("name", sql.NVarChar, customerData.name)
      .input("email", sql.NVarChar, customerData.email)
      .input("address", sql.NVarChar, customerData.address)
      .input("message", sql.NVarChar, customerData.message)
      .input("delivery", sql.NVarChar, customerData.delivery)
      .input("collection", sql.NVarChar, customerData.collection)
      .input(
        "collection_delivery_time",
        sql.NVarChar,
        customerData.collectionOrDeliveryTime
      )
      //execute query
      .query(sqlStatements.SQL_INSERT_CUSTOMER);
    //the newly inserted order is returned by the query
    customer = result.recordset[0];
    console.log("create cus", result);
  } catch (err) {
    console.log("DB Error - error inserting a new order: ", err.message);
  }
  return customer;
};
// SELECT * FROM dbo.customer WHERE email  = 'plyn85@hotmail.co.uk'
//find the user in the db by email after login
let findUserByEmail = async (userEmail) => {
  // define variable
  let userData;
  // userEmail = JSON.stringify(`plyn85@hotmail.co.uk`);
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // checks for sql injection
      .input("email", sql.NVarChar, userEmail)
      .query(sqlStatements.SQL_FIND_BY_USER_EMAIL);
    userData = result.recordset[0];

    //return the user data
    return userData;
    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - findUserByEmail: ", err.message);
  }

  // return user id
  return userData;
};

//add to db for customer that already has a email in the db from auth0 sign up
let createCustomerAfterSignUp = async (customerData) => {
  //   Declare variables
  let customer;

  //insert new customer after sign up only name and email
  // will be added to the db
  try {
    //get a database connection and insert SQLs
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("name", sql.NVarChar, customerData.nickname)
      .input("email", sql.NVarChar, customerData.email)
      //execute query
      .query(sqlStatements.SQL_INSERT_CUSTOMER_AFTER_SIGN_UP);
    //the newly inserted order is returned by the query
    customer = result.recordset[0];
    console.log("create cus after sign up", result);
  } catch (err) {
    console.log(
      "DB Error - error inserting newly signed up customer: ",
      err.message
    );
  }
  return customer;
};

module.exports = {
  createCustomer,
  findUserByEmail,
  createCustomerAfterSignUp,
};
