var express = require("express");
//.create creates a handle bar instance
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
var fortuneGen = require('./lib/fortune.js')

var app = express();



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.get('/',function(req, res) {
	res.render('index');
});

app.get('/about',function(req, res) {
	res.render('about', { fortune : fortuneGen.getFortune() });
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(3000, function(){ console.log("APP STARTED ON PORT 3000---->>>")});