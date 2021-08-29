//require the database connection

const { rows } = require("mssql");
const { sql, dbConnPoolPromise } = require("../database/db.js");

const sqlStatements = {
  SQL_INSERT_CUSTOMER_ORDER:
    "INSERT INTO dbo.orders (invoice_number,amount,address,delivery,collection,collection_delivery_time,message,customer_id) VALUES (@invoiceNumber,@amount,@address,@delivery,@collection,@collection_delivery_time,@message,@customer_id) SELECT * from dbo.orders WHERE _id = SCOPE_IDENTITY();",
  SQL_INSERT_CUSTOMER_AFTER_SIGN_UP:
    "INSERT INTO dbo.customer (name,email) VALUES (@name,@email) SELECT * from dbo.customer WHERE _id = SCOPE_IDENTITY();",
  SQL_FIND_BY_USER_EMAIL:
    "SELECT * FROM dbo.customer WHERE email = @email for json path, without_array_wrapper;",
  SQL_FIND_CUSTOMER_ADDRESS:
    "SELECT address FROM dbo.orders WHERE customer_id = @userId  for json path, without_array_wrapper;",
};

//create an order in db
let createCustomerOrder = async (customerOrder, customerOrderId) => {
  //   Declare variables
  let customerOrderCreated;

  //insert new customer
  try {
    //get a database connection and insert SQLs
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query

      // checks for sql injection
      .input("invoiceNumber", sql.NVarChar, customerOrder.invoice_number)
      .input("amount", sql.Int, customerOrder.amount)
      .input("address", sql.NVarChar, customerOrder.address)
      .input("message", sql.NVarChar, customerOrder.message)
      .input("delivery", sql.NVarChar, customerOrder.delivery)
      .input("collection", sql.NVarChar, customerOrder.collection)
      .input("customer_id", sql.Int, customerOrderId)
      .input(
        "collection_delivery_time",
        sql.NVarChar,
        customerOrder.collectionOrDeliveryTime
      )
      //execute query
      .query(sqlStatements.SQL_INSERT_CUSTOMER_ORDER);
    //the newly inserted order is returned by the query
    customerOrderCreated = result.recordset[0];
    console.log("create customer order", customerOrderCreated);
  } catch (err) {
    console.log("DB Error - error inserting a new order: ", err.message);
  }
  return customerOrderCreated;
};

//find the user in the db by email
let findUserByEmail = async (userEmail) => {
  // define variable
  let userData;
  console.log("user email", userEmail);
  console.log("is this email the same ?", userEmail === "plyn@test.com");
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // checks for sql injection
      .input("email", sql.NVarChar, userEmail)
      .query(sqlStatements.SQL_FIND_BY_USER_EMAIL);
    userData = result.recordset[0];
    console.log("find user by email", result);
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
let createCustomer = async (customerData) => {
  //   Declare variables
  let customer;
  let name;
  let nickNameExists;

  //check which key is in customerData obj
  nickNameExists = "nickname" in customerData;
  //if nickname does exist make name equal nickname otherwise it remains name
  name = nickNameExists ? customerData.nickname : customerData.name;
  //insert new customer after sign up only name and email
  // will be added to the db
  try {
    //get a database connection and insert SQLs
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      //set the name parameters in query
      // checks for sql injection
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, customerData.email)
      //execute query
      .query(sqlStatements.SQL_INSERT_CUSTOMER_AFTER_SIGN_UP);
    //the newly inserted order is returned by the query
    customer = result.recordset[0];
  } catch (err) {
    console.log("DB Error - error inserting customer: ", err.message);
  }
  return customer;
};
//
//
//find the user in the db by email
let getCustomerAddress = async (userId) => {
  // define variable
  let customerAddress;
  try {
    const pool = await dbConnPoolPromise;
    const result = await pool
      .request()
      // checks for sql injection
      .input("userId", sql.Int, userId)
      .query(sqlStatements.SQL_FIND_CUSTOMER_ADDRESS);
    customerAddress = result.recordset[0];
    //return the user data

    return customerAddress;
    // Catch and log errors to server side console
  } catch (err) {
    console.log("DB Error - getCustomerAddress: ", err.message);
  }

  // return user id
  return customerAddress;
};
module.exports = {
  createCustomerOrder,
  findUserByEmail,
  createCustomer,
  getCustomerAddress,
};
