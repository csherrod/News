// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

//Require all models
var db = require("./models/Article.js");

var port = process.env.PORT || 5000;

// Initialize Express
var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/BI";
//Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/BI");

// Set up a static folder (public) for our web app
app.engine("hbs", exphbs({
    extname: ".hbs",
    defaultLayout: "main"
  }));
  app.set("view engine", ".hbs");
  
  // Use morgan logger for logging requests
  app.use(logger("dev"));
  // Use body-parser for handling form submissions
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  // Use express.static to serve the public folder as a static directory
  app.use(express.static("public"));
// Database configuration
var databaseUrl = "BI";
var collections = ["scrapedData"];

// Main route
app.get("/", function(req, res) {
    db.find({}).then(function(dbArticle) {
        console.log(dbArticle);
        res.render("index", {
            article: dbArticle
        });
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
    
});


// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data scraped using the next route)
app.get("/scrape", function(req, res) {
request("http://www.businessinsider.com/", (function(error, response, html) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(html);
  // An empty array to save the data
  var results = [];
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("h2.overridable").each(function(i, element) {

      // Add the text and href of every link, and save them as properties of the result object
      var title = $(element)
        .children("a")
        .text();
      var link = $(element)
        .children("a")
        .attr("href");
        results.push({
            title: title,
            link: link
        });

      // Create a new Article using the `result` object built from scraping
      db.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
  }));
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  
// Listen on port 5000
app.listen(5000, function() {
  console.log("App running on port 5000!");
});