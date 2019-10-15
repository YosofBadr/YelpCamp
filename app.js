var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); 

//   {name: "Ring Treat", 
// image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"},

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schemas
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({name: "Ring Treat", image:"https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80", description: "All the treats you can imagine"})

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
      response.render("campgrounds", {campGrounds: allCampgrounds});
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
  response.render("newCamp")
});

// Show Route - Display information about a specific campground
app.get("/campgrounds/:id", function(request, response) {
  Campground.findById(request.params.id, function(err, foundCampground){
    if(err)
      console.log(err);
    else
      response.render("show", {campground: foundCampground});
  });
});

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});