//IMPORT DEPENDENCIES
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const strategy = require(`${__dirname}/strategy`);
//INITIALIZE APP
const app = express();
const port = process.env.PORT || 3001;

//MIDDLEWARES
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000000
    }
  })
);

app.use(passport.initialize());
//use session with passport
app.use(passport.session());

//use the auth0strategy within the strategy.js
passport.use(strategy);

passport.serializeUser((user, done) => {
  //this user is same object as the profile in strategy.js
  //puts the user passed in on the req.user
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  //allows us to interact with the user object
  return done(null, user);
});

//ENDPOINTS

//1st param: what authenticator to use
//2nd param: configuration object
app.get(
  "/auth",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    failureRedirect: "/auth",
    failureFlash: true
  })
);

app.get("/me", (req, res, next) => {
  //By this point, req.user should be filled up with user information.
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.status(200).json(req.user);
  }
});

//SERVER LISTENING
app.listen(port, () => console.log("Port listening on: " + port));
