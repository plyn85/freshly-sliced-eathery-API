// imports

const CustomerOrderForm = require("../models/customer.js");
const validator = require("validator");
// needs to be validated before using in the application
let validateCustomerOrder = (customerOrderData) => {
  let validatedCustomerOrder;
  console.log("customer val", customerData);
  //get the Order Data
  let invoice_number = customerOrderData.invoice_number;
  let amount = customerOrderData.amount;
  let collectionOrDeliveryTime = customerOrderData.collectionOrDeliveryTime;
  let message = customerOrderData.message;
  let address = customerOrderData.address;
  let delivery = customerOrderData.delivery;
  let collection = customerOrderData.collection;
  //console.log(name, email, message, collectionTime);
  // debug to console - if no data
  //
  if (customerData === null) {
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
    !validator.isEmpty(invoice_number) &&
    !validator.isEmpty(amount) &&
    !validator.isEmpty(collectionOrDeliveryTime) &&
    !validator.isEmpty(address) &&
    !validator.isEmpty(message) &&
    !validator.isEmpty(address) &&
    !validator.isEmpty(message)
  ) {
    // Validation passed
    // create a new customer instance based on customerOrder model
    validatedCustomerOrder = new CustomerOrderForm(
      validator.escape(invoice_number),
      validator.escape(amount),
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
