//imports

const router = require("express").Router();

// Auth0
const { authConfig, checkJwt } = require("../middleware/jwtAuth.js");
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
  //return the user data
  console.log(user.data);
  return user.data;
};
//
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
        const userProfile = await getAuthUser(token);
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

//exports
module.exports = router;
