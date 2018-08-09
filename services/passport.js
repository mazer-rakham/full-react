const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // go into the databse, find the User with the id then assign that to user and desealize
    done(null, user);
  });
});
//below is a built in functino that pass[prt uses as a means to handle the google sign in and add to mongo
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // already have a record
        return done(null, existingUser);
      }
      // no user record
      const user = await new User({
        //this creates a new model instance
        googleId: profile.id
      }).save();
      done(null, user); // this is making a second instance in the promise and saying it is done saving
    }
  )
);
