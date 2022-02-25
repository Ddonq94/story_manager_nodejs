const passport = require("passport");
const router = require("express").Router();

// google auth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
