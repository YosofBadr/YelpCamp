var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true }); 

// var campGrounds = [
//   {name: "Hollow Moor", image: "https://images.unsplash.com/photo-1494545261862-dadfb7e1c13d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
//   {name: "Ring Treat", image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"},
//   {name: "Hollow Moor", image: "https://images.unsplash.com/photo-1494545261862-dadfb7e1c13d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
//   {name: "Indian Ocean", image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
//   {name: "Ring Treat", image: "https://images.unsplash.com/photo-1482376292551-03dfcb8c0c74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"},
//   {name: "Broke Mountain", image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
// ]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schemas
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", function(request, response) {
  response.render("landing")
});

app.get("/campgrounds", function(request, response) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err)
      console.log(err);
    else
      response.render("campgrounds", {campGrounds: allCampgrounds});
  }); 
});

app.post("/campgrounds", function(request, response) {
  var campName = request.body.campName;
  var campImage = request.body.campImage;

  var newCampground = {name: campName, image: campImage}

  Campground.create(newCampground, function(err, createdCampground) {
    if(err)
      console.log(err);
    else
      response.redirect("/campgrounds");
  });

});

app.get("/campgrounds/new", function(request, response) {
  response.render("newCamp")
});

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});