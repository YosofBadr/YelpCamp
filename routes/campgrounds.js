var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");


// Index Route - Display all campgrounds
router.get("/campgrounds", function(request, response) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err)
      console.log(err);
    else
      response.render("campgrounds/index", {campGrounds: allCampgrounds, currentUser: request.user});
  }); 
});

// Create Route - Add a new campground to the DB
router.post("/campgrounds", isLoggedIn, function(request, response) {
  var campName = request.body.campName;
  var campImage = request.body.campImage;
  var campDescription = request.body.description;
  var authorDetails = {
    id: request.user._id,
    username: request.user.username
  }
  var newCampground = {name: campName, image: campImage, description: campDescription, author:authorDetails}
  Campground.create(newCampground, function(err, createdCampground) {
    if(err)
    console.log(err);
    else {
      response.redirect("/campgrounds");
    }
  });

});

// New Route - Display a form to create a new campground
router.get("/campgrounds/new", isLoggedIn, function(request, response) {
  response.render("../views/campgrounds/new")
});

// Show Route - Display information about a specific campground
router.get("/campgrounds/:id", function(request, response) {
  Campground.findById(request.params.id).populate("comments").exec(function(err, foundCampground){
    if(err)
      console.log(err);
    else
      response.render("campgrounds/show", {campground: foundCampground});
  });
});

// Edit Route
router.get("/campgrounds/:id/edit", checkCampgroundAuthorisation, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// Update Route
router.put("/campgrounds/:id", checkCampgroundAuthorisation, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err)
      res.redirect("/campgrounds");
    else
      res.redirect("/campgrounds/" + req.params.id);
  });
});

// Delete Route
router.delete("/campgrounds/:id", checkCampgroundAuthorisation, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err)
      console.log(err);
  
    res.redirect("/campgrounds");
  });
});

// Checks if a user is authenticated, if not then user is redirected to the login page
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundAuthorisation(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err)
        res.redirect("back");
      else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else
          res.redirect("back");
      }
    });
  }
  else {
    res.redirect("back");
  }  
}

module.exports = router;
