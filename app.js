var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var campGrounds = [
  {name: "Indian Ocean", image: "https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c722f7dd4944ecd5f_340.jpg"},
  {name: "Broke Mountain", image: "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c722f7dd4944ecd5f_340.jpg"},
  {name: "Hollow Moor", image: "https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c722f7dd4944ecd5f_340.jpg"},
  {name: "Ring Treat", image: "https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c722f7ed29145c251_340.jpg"},
]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.render("landing")
});

app.get("/campgrounds", function(request, response) {
  response.render("campgrounds", {campGrounds: campGrounds});
});

app.post("/campgrounds", function(request, response) {
  var campName = request.body.campName;
  var campImage = request.body.campImage;

  var newCampground = {name: campName, image: campImage}
  campGrounds.push(newCampground);

  response.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(request, response) {
  response.render("newCamp")
});

app.listen(3000, function() {
  console.log("YelpCamp listening on 3000");
});