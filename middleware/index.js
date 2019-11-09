var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundAuthorisation = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
        req.flash("error", "" + err);
        res.redirect("back");
      }
      else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else {
          req.flash("error", "Permissions required");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "Login required");
    res.redirect("back");
  }  
}

middlewareObj.checkCommentAuthorisation = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        req.flash("error", "" + err);
        res.redirect("back");
      }
      else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }
        else {
          req.flash("error", "Permissions required");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "Login required");
    res.redirect("back");
  }  
}

// Checks if a user is authenticated, if not then user is redirected to the login page
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Login required");
  res.redirect("/login");
}

module.exports = middlewareObj;