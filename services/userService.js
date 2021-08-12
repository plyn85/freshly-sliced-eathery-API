//imports
const { authConfig } = require("../middleware/jwtAuth.js");
const customerValidation = require("../validators/customerValidation");
const userRepository = require("../repositories/userRepository");

//axios

const axios = require("axios").default;

//get the user info from auth
let getAuthUser = async (accessToken) => {
  //get user info from auth0
  const url = `${authConfig.issuer}userinfo`;
  const config = {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  };
  //use access to make request
  const user = await axios.get(url, config);

  //pass the users email to the function that finds user by email
  let userData = await getCustomerInfoDbByEmail(user.data.email);
  console.log(" auth by email userData: ", userData);
  //if the user data is not null
  if (userData == null) {
    //pass to repository to add to db
    userData = await userRepository.createCustomer(user.data);
  } else {
    console.log("user already exists in db, createCustomer :", userData);
  }
  //return the user data
  console.log("userService: ", userData);
  return userData;
};
//
//function to handle the customer data
let createCustomer = async (customer) => {
  //constants and variables
  let validatedCustomer;

  //validate customer and create instance
  let validateCustomer = customerValidation.validateCustomer(customer);
  console.log("val cust", validateCustomer);
  // if the validation is a success
  if (validateCustomer != null) {
    //check if the user is already in the db
    let validatedCustomer = await getCustomerInfoDbByEmail(customer.email);
    //if the user data is not null
    if (validatedCustomer != null) {
      //pass to repository to add to db
      validatedCustomer = await userRepository.createCustomer(validateCustomer);
    } else {
      console.log(
        "user already exists in db, createCustomer :",
        validatedCustomer
      );
    }
    return validatedCustomer;
  }

  console.log("customerInfo", validatedCustomer);
  //and
  //return the object
  return validatedCustomer;
};

///function checks if the user is in the database
let getCustomerInfoDbByEmail = async (customerEmail) => {
  //check if the user is in db if it is not then they have just registered
  let userData = await userRepository.findUserByEmail(customerEmail);
  //add to db by calling the createCustomer function
  if (userData == null) {
    console.log("user not in db");
  }

  //if the customer is already in the database
  else {
    console.log("User in Db getAuthUser :", userData);
  }
  return userData;
};

//exports
module.exports = {
  getAuthUser,
  createCustomer,
  getCustomerInfoDbByEmail,
};
