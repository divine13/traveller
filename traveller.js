var express = require("express");
//.create creates a handle bar instance
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
var fortuneGen = require('./lib/fortune.js');

var app = express();
app.disable('x-powered-by');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {} //partials context =  object. available to all views
	res.locals.partials.weather = getWeatherData(); //creating a weather object/ weather context 
	next();
});

app.get('/',function(req, res) {
	res.render('index');
});

app.get('/metrics',function(req, res) {
	res.set('Content-type', 'text/plain');
	var s = '';

	for (var name in req.headers) { 
		console.log(name); 
		s += name + ': ' + req.headers[name] + '\n'}
	res.send(s);
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


function getWeatherData(){  //TODO: should put this in its own library
return {
locations: [
{
name: 'Portland',
forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
weather: 'Overcast',
temp: '54.1 F (12.3 C)',
},
{
name: 'Bend',
forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
weather: 'Partly Cloudy',
temp: '55.0 F (12.8 C)',
},
{
name: 'Manzanita',
forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
weather: 'Light Rain',
temp: '55.0 F (12.8 C)',
},
],
};
}


app.listen(3000, function(){ console.log("APP STARTED ON PORT 3000---->>>"); });