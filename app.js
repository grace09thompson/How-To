/* Name: Grace Thompson
* How To: Using the Open Secrets API
*/

var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var session = require('express-session');

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.use(session({secret:'SecretNotSoSecret'}));

app.use(express.static(__dirname + '/public'));

var request = require('request'); //signals use of Request Library

var apiKey = "API KEY HERE";
var bernie = "N00000528";
var hillary = "N00000019";
var ben = "N00036973";
var ted = "N00033085";
var marco = "N00030612";
var donald = "N00023864";
var john = "N00009778";

app.get('/', function(req, res, next) {
  var context = {};
  request("http://www.opensecrets.org/api/?method=memPFDprofile&year=2013&cid=" + bernie + "&output=json&apikey=" + apiKey, function(err, response, body) {
    if(!err && response.statusCode < 400) {
      var data = JSON.parse(body);
      var pfdProfile = data.response.member_profile['@attributes'];
      var profile = [];

      for (keyName in pfdProfile) {
        profile.push({'name': keyName, 'value': pfdProfile[keyName]});
       }

      context.profile = profile;
      context.pageName = "About OpenSecrets.org"
      res.render('home.handlebars', context);
    } else {
      if(response) {
        console.log("Error " + response.statusCode);
      }
      next(err);
    }

  });

});

app.get('/gettingStarted', function(req, res) {
  var context = {};
  context.pageName = "Signing up to access the Open Secrets API";
  res.render('gettingStarted.handlebars', context);
});

app.get('/makingCalls', function(req, res) {
  var context = {};
  context.pageName = "Making calls to the OpenSecrets API";
  res.render('makingCalls.handlebars', context);
});

app.get('/methods', function(req, res) {
  var context = {};
  context.pageName = "Method calls for the OpenSecrets API";
  res.render('methods.handlebars', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
