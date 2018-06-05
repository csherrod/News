$(".new").on("click", function(event) {
  event.preventDefault();
});

$(".clear").on("click", function(event) {
  event.preventDefault();
  $("#articles").empty();
});


$(document).on("click", ".save", function() {
  console.log(id);
  $.ajax({
    type: "PUT",
    url: "/saved",
    data: {
      id: id
    }
  });

});


$(document).on("click", ".save", function() {
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + this._id,
    data: {
      // Value taken from title input
      title: this.title,
      // Value taken from note textarea
      link: this.link
    }
  });
});