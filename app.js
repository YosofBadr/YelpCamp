var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");



// ================ AUTHENTICATION ======================
var passport = require("passport");
var passportLocal = require("passport-local");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

// Schemas
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

// Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

var seedDB = require("./seeds");
// seedDB();

// Passport Config
app.use(require("express-session")({
  secret: "Anything I want can go here",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass current user data to all routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// Middleware to pass message needed for flash to all routes
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});