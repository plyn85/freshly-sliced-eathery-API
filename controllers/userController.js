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
    res.json("request heard");
    console.log(req.headers["authorization"]);
    //   // if logged in (therefore access token exists)
    //
    if (req.headers["authorization"]) {
      try {
        let token = await req.headers["authorization"].replace("Bearer ", "");
        const userProfile = await userService.getAuthUser(token);
        console.log("%c user profile: ", "color: blue", userProfile);
        console.log("%c user email: ", "color: blue", userProfile.email);
      } catch (err) {
        console.log(`ERROR getting user profile: ${err.message}`);
      }
    }
    try {
      let result = await getAuthUser();
      console.log("collection order", result._id);
      res.json(result);
    } catch (err) {
      res.status(500);
    }
  }
);

//to handle collection or delivery info and create a customer in the db
router.post("/collectionOrDelivery", async (req, res) => {
  //getting the body of the request
  let customerData = req.body;
  console.log(customerData);
  //sending the request body to collection function
  try {
    let result = await userService.createCustomer(customerData);
    console.log("collection order", result._id);
    res.json(result);
  } catch (err) {
    res.status(500);
  }
});

//exports
module.exports = router;
