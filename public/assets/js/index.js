console.log("app.js loaded");

function displayResults(data) {
  $("#results").empty();
  // Add to the table here...
  for (var i = 0; i < data.length; i++) {
    $("#results").prepend("<li>" + data[i].title + "</li><a href=" + data[i].link + ">" + data[i].link + "</a><br><button class='save' data-id=" + data[i]._id + ">Save Article</button><br>");
  }
}
$.getJSON("/articles", function(data) {
  // Call our function to generate a table body
  displayResults(data);
});

$.getJSON("/scrape", function() {
  // Call our function to generate a table body
  res.send("scraped");
});

$(document).on("click", ".save", function() {
  var id = $(this).attr("data-id");
  console.log(id);
  $.ajax({
    type: "PUT",
    url: "/saveart",
    data: {
      id: id
    }
  });

});