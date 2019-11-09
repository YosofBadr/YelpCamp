var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route - Display landing page for the application
router.get("/", function(request, response) {
  response.render("landing")
});

// Authentication Routes ==============================

// Show Route - Displays Register Form
router.get("/register", function(req, res){
  res.render("register");
});

// Create Route - Handles user registration
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome, " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show Route - Displays Login Form
router.get("/login", function(req, res){
  res.render("login");
});

// Post Route - Handles user login
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res){
  res.send("Loging in");
});

// Logout Route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
});

// Checks if a user is authenticated, if not then user is redirected to the login page
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;