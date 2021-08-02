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
  //send  the user data to userRepo
  let userData = userRepository.findUserByEmail(user.data.email);
  return user.data;
};

//
//function to handle the collection data
let createCustomer = async (customer) => {
  //constants and variables
  let validatedCustomer;

  //validate customer and create instance
  let validateCustomer = customerValidation.validateCustomer(customer);

  //
  // if the validation is a success
  if (validateCustomer != null) {
    //pass to repository to add to db
    validatedCustomer = await userRepository.createCustomer(validateCustomer);
  }
  console.log("customerInfo", validatedCustomer);
  //and
  //return the object
  return validatedCustomer;
};

module.exports = {
  getAuthUser,
  createCustomer,
};
