var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware");

// New Route - Display a form to create a new comment for a campground
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground){
    if(err)
      console.log("An error has occured: " + err);
    else
      response.render("comments/new", {campground: campground});
  });
});

// Create Route - Add a new comment and associate it to a campground in the DB
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(request, response){
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

// Edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentAuthorisation, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err)
      console.log(err);
    else
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
  });
});

// Update route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthorisation, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err)
      res.redirect("back");
    else
      res.redirect("/campgrounds/" + req.params.id);
  });
});

// Destroy route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthorisation, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err)
      console.log(err);
    else
      res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;