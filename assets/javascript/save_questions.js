function driver () {
  var srcDifficulty = "medium"
  var srcComputerScience = "https://opentdb.com/api.php?amount=10&category=18&difficulty=" + srcDifficulty + "&type=multiple"
  var results

  var successful = function(response) {
    console.log("API request Successful")
    results = response.results
    console.log(results)
    saveResults(results)
  }
  var failed = function() {
    console.log("API quest Failed. Switching to local question defaults")
  }

  $.ajax({
    url: srcComputerScience,
    method: "GET"
  }).then(successful, failed)
}

function saveResults (results) {
  const fs = require('fs')
  fs.writeFile("dont_cheat.txt", results, function(e) {
    if (e)
      console.log(e);
  })
  console.log("json saved")
}


function loadResults () {
  $.getJSON("demo_ajax_json.js", function(result){
    $.each(result, function(){
       console.log(result);
    });
});
}
driver()