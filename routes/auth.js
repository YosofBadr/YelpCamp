// Root Route - Display landing page for the application
app.get("/", function(request, response) {
  response.render("landing")
});

// Authentication Routes ==============================

// Show Route - Displays Register Form
app.get("/register", function(req, res){
  res.render("register");
});

// Create Route - Handles user registration
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log("An error has occured: " + err);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// Show Route - Displays Login Form
app.get("/login", function(req, res){
  res.render("login");
});

// Post Route - Handles user login
app.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res){
  res.send("Loging in");
});

// Logout Route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

// Checks if a user is authenticated, if not then user is redirected to the login page
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}