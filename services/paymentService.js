//imports
const cartRepository = require("../repositories/cartRepository");
const baseValidators = require("../validators/baseValidators");

//stripe secret key
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//function to handle order stripe payment and order
let stripeHandlePayment = async (stripeBody, userId) => {
  console.log("i is here");
  let userCart;
  //validate the id form request body
  let validateId = baseValidators.validatePositiveNumber(userId);
  //if validation is true
  if (validateId) {
    //get the users cart
    userCart = await cartRepository.getCartByUserId(userId);
    console.log(userCart.subtotal);
  }

  //add the customer info and payment to stripe
  try {
    const customer = await stripe.customers.create({
      description: stripeBody.card.id,
      source: stripeBody.id,
    });
    //add the charge info to stripe
    const charge = await stripe.charges.create({
      //passing in the current cart subtotal as the amount
      amount: userCart.subtotal * 100,
      currency: "eur",
      source: "tok_mastercard",
      description: customer.id,
    });

    //if the charge status returns as succeeded from charge object
    //the payment was a success
    if (charge.status == "succeeded") {
      //delete there cart
      const deleteCart = await cartRepository.deleteCart(userCart._id);
      //if the cart was deleted
      if (deleteCart) {
        console.log("cart deleted");
        // build an object form stripe charges and return response
        return (customerInfo = {
          invoice_num: customer.invoice_prefix,
          amount_charged: charge.amount,
        });
      } else {
        console.log("cart deletion failed");
      }
    } else {
      console.log("Payment failed");
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  stripeHandlePayment,
};
