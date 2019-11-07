var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// ================ AUTHENTICATION ======================
var passport = require("passport");
var passportLocal = require("passport-local");


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Schemas
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var seedDB = require("./seeds");
seedDB();

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

// Root Route - Display landing page for the application
app.get("/", function(request, response) {
  response.render("landing")
});

// Index Route - Display all campgrounds
app.get("/campgrounds", function(request, response) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err)
      console.log(err);
    else
      response.render("campgrounds/index", {campGrounds: allCampgrounds});
  }); 
});

// Create Route - Add a new campground to the DB
app.post("/campgrounds", function(request, response) {
  var campName = request.body.campName;
  var campImage = request.body.campImage;
  var campDescription = request.body.description;

  var newCampground = {name: campName, image: campImage, description: campDescription}

  Campground.create(newCampground, function(err, createdCampground) {
    if(err)
      console.log(err);
    else
      response.redirect("/campgrounds");
  });

});

// New Route - Display a form to create a new campground
app.get("/campgrounds/new", function(request, response) {
  response.render("new")
});

// Show Route - Display information about a specific campground
app.get("/campgrounds/:id", function(request, response) {
  Campground.findById(request.params.id).populate("comments").exec(function(err, foundCampground){
    if(err)
      console.log(err);
    else
    {
      console.log(foundCampground);
      response.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


// Comment Routes ==============================

// New Route - Display a form to create a new comment for a campground
app.get("/campgrounds/:id/comments/new", function(request, response) {
  Campground.findById(request.params.id, function(err, campground){
    if(err)
      console.log("An error has occured: " + err);
    else
      response.render("comments/new", {campground: campground});
  });
});


// Create Route - Add a new comment and associate it to a campground in the DB
app.post("/campgrounds/:id/comments", function(request, response){
  Campground.findById(request.params.id, function(err, campground){
    if(err) {
      console.log("An error has occured: " + err);
      response.redirect("/campgrounds");
    }
    else {
      Comment.create(request.body.comment, function(err, comment){
        if(err) 
          console.log("An error has occured: " + err);   
        else {
          campground.comments.push(comment);
          campground.save()
          response.redirect("/campgrounds/" + campground._id);    
        }
      });
    }
  });
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

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});