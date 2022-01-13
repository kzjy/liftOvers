var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");


// create express app
var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors({ 
  exposedHeaders: 'Authorization',
  origin: ["http://localhost:3000", "http://localhost:7000", "https://cryptic-thicket-16667.herokuapp.com"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
}));
// app.all("/*", function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type', 'Set-Cookie');
//   next();
// });

const port = process.env.PORT || 7000;


// MongoDB configs
var dbConfig = require("./config/config.js");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url,{ useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("Successfully connected to the database")
  })
  .catch(err => {
    console.log("Could not connect to the database")
    process.exit()
  }
);

// Express session
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: 'super-secret-liftover',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 3600000,
    httpOnly: false,
    secure: false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

// Passport
const passport = require('passport')
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())


// mongoose.connection.on("error", function() {
//   console.log("Could not connect to the database. Exiting now...");
//   process.exit();
// });

// mongoose.connection.once("open", function() {
//   console.log("Successfully connected to the database");
// });

// define a simple route
// app.get("/", function(req, res) {
//   res.json({ message: "Welcome to the LiftOvers API" });
// });

// require("./app/routes/index.js")(app);

// Routes 



app.use('/', require('./app/routes/index'))
app.use('/volunteer', require('./app/routes/volunteers'))
app.use('/lift', require('./app/routes/lifts'))
app.use('/admin', require('./app/routes/admins'))
//app.use('/donor', require('./app/routes/donors'))

// listen for requests
app.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});
