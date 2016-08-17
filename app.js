var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var ejs = require('ejs');

var app = express();

//Intitiaizing middleware for node
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

//Handling post request of URL
app.post('/', function(req, res) {

  var repoAPI = getApiUrl(req.body.url);

  //Initial Issues data
  var responseData = {
    'openIssues': 0,
    'last24hours': 0,
    'lessThan7days': 0,
    'moreThan7days': 0
  }

  //Request options to make github API call
  var requestOptions = {
    url: repoAPI,
    headers: {
      'User-Agent': 'gowthamhosur'
    }
  };

  //API call to github
  request(requestOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {

      var apiResponse = JSON.parse(body)

      var currentDate = new Date();
      var previousDate = new Date(+new Date() - 1000 * 60 * 60 * 24);
      var $7daysagoDate = new Date(+new Date() - 1000 * 60 * 60 * 24 * 7);

      //Filtering issues for last 24 hours
      var last24hoursIssues = apiResponse.filter(function(d, i) {
        return new Date(d["created_at"]) > previousDate && new Date(d["created_at"]) <= currentDate;
      });

      //Filtering issues for more than 24 hours ago but less than 7 days ago
      var lessThan7daysIssues = apiResponse.filter(function(d, i) {
        return new Date(d["created_at"]) > $7daysagoDate && new Date(d["created_at"]) <= previousDate;
      });

      //Filtering issues for more than 7 days ago
      var moreThan7daysIssues = apiResponse.filter(function(d, i) {
        return new Date(d["created_at"]) <= $7daysagoDate;
      });


      //Setting count of required issues in responseData object
      responseData.openIssues = apiResponse.length;
      responseData.last24hours = last24hoursIssues.length;
      responseData.lessThan7days = lessThan7daysIssues.length;
      responseData.moreThan7days = moreThan7daysIssues.length;

      //Sending counts as response
      res.send(responseData);
    }
  });

});

//Starting server at port 8080
app.listen(8080, function() {
  console.log("Serving on port 8080...");
});

//Function to get api url for a github repo
var getApiUrl = function(url) {
  var words = url.split('/');
  var rootIndex = words.indexOf('github.com'); //Finding root domain URL index to get Repo name


  //Generating API URl
  if (words.length >= (rootIndex + 2))
    return 'https://api.github.com/repos/' + words[++rootIndex] + '/' + words[++rootIndex] + "/issues?per_page=999";
  else {
    return false;
  }

}
