const Auth0Strategy = require("passport-auth0");

module.exports = new Auth0Strategy(
  {
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    scope: "openid profile",
    callbackURL: "/auth"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    //When this done fires, it fires serializeUser in index.js
    return done(null, profile);
  }
);
