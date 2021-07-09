const Users = require("../models/users.js");
const validator = require("validator");
const crypto = require("crypto");
//validate the user data

const validateUser = (userData) => {
  let validatedUser;
  //get the password and email form the user data
  let password = userData.password;
  let email = userData.email;
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");

  //check the if user data is empty
  if (userData === null) {
    console.log("validateUser(): Parameter is null");
  }
  //validate the password and email
  if (
    (!validator.isEmpty(password) && validator.isEmail(email),
    !validator.isEmpty(salt),
    !validator.isEmpty(hash))
  ) {
    //validation passed
    // create a new customer instance based on customer model
    validatedUser = new Users(
      validator.escape(email),
      validator.escape(password),
      validator.escape(salt),
      validator.escape(hash),
      salt,
      hash
    );
  } else {
    // debug
    console.log("validateUser(): Validation failed");
  }

  // //validate the password
  // Users.prototype.validatePassword = function () {
  //   const hash = crypto
  //     .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
  //     .toString("hex");
  //   return this.hash === hash;
  // };

  // Users.validatePassword();
  // console.log(crypto.randomBytes(16).toString("hex"));
  console.log(Users);
  return validatedUser;
};

module.exports = { validateUser };
