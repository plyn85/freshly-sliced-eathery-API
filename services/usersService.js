//imports
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//allow the user to login
const loginUser = async (userData) => {
  return userData;
};

//exports
module.exports = { loginUser };
