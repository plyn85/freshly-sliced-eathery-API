// require imports packages required by the application
const express = require("express");
const cors = require("cors");

const HOST = "127.0.0.1";
const PORT = 8000;

// app is a new instance of express (the web app framework)
let app = express();

// Application settings
app.use((req, res, next) => {
  // Globally set Content-Type header for the application
  res.setHeader("Content-Type", "application/json");
  next();
});

// Allow app to support differnt body content types (using the bidyParser package)
app.use(express.text());
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support url encoded bodies

// cors
// https://www.npmjs.com/package/cors
// https://codesquery.com/enable-cors-nodejs-express-app/
// Simple Usage (Enable All CORS Requests)
// app.use(cors());
// app.options("*", cors()); // include before other routes
app.use(cors({ credentials: true, origin: true }));
//copied an posted from https://www.zigpoll.com/blog/cors-with-express-and-fetch
// used instead of cors
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);

//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
/* Configure app Routes to handle requests from browser */
// The home page
app.use("/", require("./controllers/index"));
//the menu page
app.use("/meals", require("./controllers/menuController"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found: " + req.method + ":" + req.originalUrl);
  err.status = 404;
  next(err);
});

// Start the HTTP server using HOST address and PORT consts defined above
// Lssten for incoming connections
var server = app.listen(PORT, HOST, function () {
  console.log(`Express server listening on http://localhost:${PORT}`);
});

// export this as a module, making the app object available when imported.
module.exports = app;
