//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

const sqlStatements = {
  SQL_INSERT_CUSTOMER:
    "INSERT INTO dbo.customer (name,email,address,delivery,collection,collection_delivery_time,message) VALUES (@name,@email,@address,@delivery,@collection,@collection_delivery_time,@message) SELECT * from dbo.customer WHERE _id = SCOPE_IDENTITY();",

  SQL_FIND_BY_USER_EMAIL:
    "SELECT * FROM dbo.customer WHERE email  = @email for json path, without_array_wrapper;",
};

//create an order in db
let createCustomer = async (customerData) => {
  console.log(customerData);
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
    //console.log("repo", customer);
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
    console.log("userRepo", userData);
    return userData;
    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - findUserByEmail: ", err.message);
  }

  // return user id
  return userData;
};

module.exports = {
  createCustomer,
  findUserByEmail,
};