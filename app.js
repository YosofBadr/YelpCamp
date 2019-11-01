var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schemas
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var seedDB = require("./seeds");
seedDB();

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

app.get("/campgrounds/:id/comments/new", function(request, response) {
  response.render("comments/new");
});

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});