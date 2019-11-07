var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comment Routes ==============================
// New Route - Display a form to create a new comment for a campground
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground){
    if(err)
      console.log("An error has occured: " + err);
    else
      response.render("comments/new", {campground: campground});
  });
});


// Create Route - Add a new comment and associate it to a campground in the DB
router.post("/campgrounds/:id/comments", isLoggedIn, function(request, response){
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
          // Associate comment with an author
          comment.author.id = request.user._id;
          comment.author.username = request.user.username;
          comment.save();

          campground.comments.push(comment);
          campground.save()
          response.redirect("/campgrounds/" + campground._id);    
        }
      });
    }
  });
});

// Checks if a user is authenticated, if not then user is redirected to the login page
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;