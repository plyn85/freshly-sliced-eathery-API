// Input validation package
// https://www.npmjs.com/package/validator
const validator = require("validator");

// Validate id field
let validateId = (id) => {
  // check if number is numeric
  if (
    validator.isNumeric(id + "", { no_symbols: true, allow_negatives: false })
  ) {
    return true;
  } else {
    console.log(`Numeric Id validatation error: ${id}`);
  }
  // validation failed
  return false;
};

let validatePrice = (price) => {
  // check price: currency symbol optional, no negative values, 2 decimal places
  if (
    validator.isCurrency(price + "", {
      require_symbol: false,
      allow_negatives: false /*, digits_after_decimal: [2] */,
    })
  ) {
    return true;
  } else {
    console.log(`Price validatation error: ${price}`);
  }
  // validation failed
  return false;
};

// Validate id field
let validatePositiveNumber = (number) => {
  // check if number is numeric
  if (
    validator.isNumeric(number + "", {
      no_symbols: true,
      allow_negatives: false,
    })
  ) {
    return true;
  } else {
    console.log(`Positive Number validatation error: ${number}`);
  }
  // validation failed
  return false;
};

module.exports = {
  validateId,
  validatePrice,
  validatePositiveNumber,
};
