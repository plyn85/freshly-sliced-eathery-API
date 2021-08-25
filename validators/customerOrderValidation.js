// imports

const CustomerOrderForm = require("../models/customer.js");
const validator = require("validator");
const baseValidators = require("../validators/baseValidators");
// needs to be validated before using in the application
let validateCustomerOrder = (customerOrderData) => {
  let validatedCustomerOrder;

  //get the Order Data
  let name = customerOrderData.name;
  let email = customerOrderData.email;
  let invoice_number = customerOrderData.invoice_number;
  let amount = customerOrderData.amount;
  let collectionOrDeliveryTime = customerOrderData.collectionOrDeliveryTime;
  let message = customerOrderData.message;
  let address = customerOrderData.address;
  let delivery = customerOrderData.delivery;
  let collection = customerOrderData.collection;
  //add decimal places to the amount
  amount = (amount / 100).toFixed(2) * 1;

  //console.log(name, email, message, collectionTime);
  // debug to console - if no data
  //
  if (customerOrderData === null) {
    console.log("validateCustomer(): Parameter is null");
  }
  //if the message is empty
  if (message === "") {
    message = `no message`;
  }

  //if delivery is empty
  if (address === "") {
    address = `customer has chosen to collect there meal`;
  }

  //if the customer has chosen the collection option;
  if (collection) {
    collection = `yes`;
    delivery = `no`;
  }
  //if they did not
  else {
    collection = `no`;
    delivery = `yes`;
  }

  if (
    !validator.isEmpty(name) &&
    validator.isEmail(email) &&
    !validator.isEmpty(invoice_number) &&
    baseValidators.validatePositiveNumber(amount) &&
    !validator.isEmpty(collectionOrDeliveryTime) &&
    !validator.isEmpty(address) &&
    !validator.isEmpty(message) &&
    !validator.isEmpty(collection) &&
    !validator.isEmpty(delivery)
  ) {
    // Validation passed
    // create a new customer instance based on customerOrder model
    validatedCustomerOrder = new CustomerOrderForm(
      validator.escape(name),
      validator.escape(email),
      validator.escape(invoice_number),
      amount,
      validator.escape(collectionOrDeliveryTime),
      validator.escape(address),
      validator.escape(message),
      validator.escape(collection),
      validator.escape(delivery)
    );
  } else {
    // debug
    console.log("validateCustomer(): Validation failed");
  }

  return validatedCustomerOrder;
};
// Module exports
// expose these functions
module.exports = {
  validateCustomerOrder,
};
