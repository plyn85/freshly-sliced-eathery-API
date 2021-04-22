// imports

const CustomerForm = require("../models/customer.js");
const validator = require("validator");
// needs to be validated before using in the application
let validateCustomer = (customerData) => {
  let validatedCustomer;

  //get the collection Data
  let collectionTime = customerData.collection_time;
  let message = customerData.message;
  let name = customerData.name;
  let email = customerData.email;
  //console.log(name, email, message, collectionTime);
  // debug to console - if no data
  //
  if (customerData === null) {
    console.log("validateCustomer(): Parameter is null");
  }
  //if the message is empty
  if (message === "") {
    message = `no message left by customer`;
  }
  if (
    !validator.isEmpty(name) &&
    validator.isEmail(email) &&
    !validator.isEmpty(collectionTime) &&
    !validator.isEmpty(message)
  ) {
    // Validation passed
    // create a new cartItem instance based on CartItem model object
    validatedCustomer = new CustomerForm(
      validator.escape(name),
      validator.escape(email),
      validator.escape(collectionTime),
      validator.escape(message)
    );
  } else {
    // debug
    console.log("validateCustomer(): Validation failed");
  }
  return validatedCustomer;
};
// Module exports
// expose these functions
module.exports = {
  validateCustomer,
};
