// Comment Routes ==============================

// New Route - Display a form to create a new comment for a campground
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(request, response) {
  Campground.findById(request.params.id, function(err, campground){
    if(err)
      console.log("An error has occured: " + err);
    else
      response.render("comments/new", {campground: campground});
  });
});


// Create Route - Add a new comment and associate it to a campground in the DB
app.post("/campgrounds/:id/comments", isLoggedIn, function(request, response){
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