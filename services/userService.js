//imports
const { authConfig } = require("../middleware/jwtAuth.js");
const customerOrderValidation = require("../validators/customerOrderValidation");
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
    console.log("this user just singed up");
  } else {
    console.log("user already exists in db, createCustomer :", userData);
  }

  return userData;
};
//
//function to handle the collection data
let createCustomerOrder = async (customerOrder) => {
  //constants and variables
  let createdCustomerOrder;
  let customerOrderObjToBeReturned;
  let getOrCreateCustomer;
  //validate customer and create instance
  let validateCustomerOrder =
    customerOrderValidation.validateCustomerOrder(customerOrder);

  //
  // if the validation is a success
  if (validateCustomerOrder != null) {
    //check if the customer is already in db by their email
    getOrCreateCustomer = await getCustomerInfoDbByEmail(
      validateCustomerOrder.email
    );
    //if they are not add their name and email to db
    if (getOrCreateCustomer == null) {
      getOrCreateCustomer = await userRepository.createCustomer(
        validateCustomerOrder
      );

      console.log("customer created", getOrCreateCustomer);
    }
    //create the customer order pass the PK id of the created customer
    //which wiLL be the FK of the of the order table
    createdCustomerOrder = await userRepository.createCustomerOrder(
      validateCustomerOrder,
      getOrCreateCustomer._id
    );
  }
  //add the order and customer info to the object
  customerOrderObjToBeReturned = {
    ...getOrCreateCustomer,
    ...createdCustomerOrder,
  };
  //return the object
  return customerOrderObjToBeReturned;
};

//
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
  createCustomerOrder,
  getCustomerInfoDbByEmail,
};
