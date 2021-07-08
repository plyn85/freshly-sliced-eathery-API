//imports
const userDataValidation = require("../validators/userDataValidation");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//allow the user to login
const loginUser = async (userData) => {
  let validatedUserData;
  //validate the user data
  let validateUserData = userDataValidation.validateUser(userData);
  //if it returns true
  if (validateUserData) {
    validatedUserData = validateUserData;
  }
  return validatedUserData;
};

//exports
module.exports = { loginUser };
