const passport = require("passport");

// this code below is exporting a function with the app as a premiter

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );
  app.get("/auth/google/callback", passport.authenticate("google"));
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });
  app.get("/api/current_user", (req, res) => {
    res.send(req.session);

    // res.send(req.user);
  });
};
