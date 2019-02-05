// Dependencies requirements, Express 4
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose        = require("mongoose");
var app            = express();

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


//Add the routes and connection db
routes = require('./routes/controller')(app);
mongoose.connect('mongodb://localhost/vehicle', function(err, res) {
  if(err) {
    console.log('error connecting to vehicle Database. ' + err);
  } else {
    console.log('Connected to Database vehicle');
  }
});
app.listen(8082);
console.log('Server Active on  port 8082');
app.get('/', function(req, res) {
  res.send("Expres, Mongoose y Node.js ");
});