// Index Route - Display all campgrounds
app.get("/campgrounds", function(request, response) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err)
      console.log(err);
    else
      response.render("campgrounds/index", {campGrounds: allCampgrounds, currentUser: request.user});
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
