// Imports
const router = require("express").Router();
const paymentService = require("../services/paymentService");

//to handle stripe payments
router.post("/:id", async (req, res) => {
  console.log("i is here");
  //get stipe body and cart id from the request body
  let stripeBody = req.body;
  let userId = req.params.id;

  try {
    let result = await paymentService.stripeHandlePayment(stripeBody, userId);
    console.log("amount", result);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
