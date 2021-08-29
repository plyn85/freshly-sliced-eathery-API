//imports

const router = require("express").Router();
const userService = require("../services/userService.js");
// Auth0
const { checkJwt } = require("../middleware/jwtAuth.js");

//route to get customer info after login
router.get(
  "/login",
  checkJwt,
  //checkAuth([authConfig.read]),
  async (req, res) => {
    //   // if logged in (therefore access token exists)
    //
    if (req.headers["authorization"]) {
      try {
        let token = await req.headers["authorization"].replace("Bearer ", "");
        const customerInfo = await userService.getAuthUser(token);
        //log the user profile to the console
        console.log("customer info-login route: ", customerInfo);
        //return the user profile info to the client
        res.json(customerInfo);
      } catch (err) {
        console.log(`ERROR getting customer info : ${err.message}`);
        res.status(500);
      }
    }
  }
);

//to handle collection or delivery info and create a customer in the db
router.post("/create-customer-order", async (req, res) => {
  //getting the body of the request
  let customerOrderData = req.body;

  //sending the request body to collection function
  try {
    let result = await userService.createCustomerOrder(customerOrderData);
    console.log("result", result);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//exports
module.exports = router;
