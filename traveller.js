var express = require("express");
var app = express();
var formidable = require('formidable');
var credentials = require('./credentials');
var cookies = require('cookie-parser');

//.create creates a handle bar instance
var handlebars = require('express3-handlebars').create({
	defaultLayout: 'main',  
		helpers :{
			section : function (name, options) {
			  if(!this._sections) this._sections = {};
			   this._sections[name] = options.fn(this); //TODO DIG THIS  fn
			   return null;
			}
		}			
});

var fortuneGen = require('./lib/fortune.js');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); 

app.disable('x-powered-by');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(cookies(credentials.cookieSecret));
app.use(require('express-session')());


app.use(function(req, res, next) { //every time when a req comes in this will be executed
	console.log(JSON.stringify(req.session.flash));
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

app.use(function(err, req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {}; //partials context =  object. available to all views
	res.locals.partials.weather = getWeatherData(); //creating a weather object/ weather context 
	next();
});


app.get('/',function(req, res) {
	res.cookie('monster', 'mon mon');
	res.cookie('monster_signed', 'mon mon', {signed: true});

	res.render('index');
});

app.get('/contest/vaction-photo', function(req, res){
	var now = new Date();
	console.log(req.cookies.monster);
	console.log(JSON.stringify(req.cookies));
	res.render('vaction-photo', { year: now.getFullYear(), month: now.getMonth() });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = formidable.IncomingForm(); //TODO: LOOK INTO SOURCE
	form.parse(req, function(err, fields, files) {
		if(err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
        res.redirect(303, '/thank-you');
	});

});

app.get('/metrics',function(req, res) {
	res.set('Content-type', 'text/plain');
	var s = '';
	for (var name in req.headers) { 
		console.log(name); 
		s += name + ': ' + req.headers[name] + '\n';
	}
	res.send(s);
});


app.get('/newsletter', function(req, res){
	 res.render('newsletter', { csrf : 'CSRF GOES HERE'});
});

app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
    // console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    // console.log('Name (from visible form field): ' + req.body);
    // console.log('Email (from visible form field): ' + req.body.email);

    console.log( JSON.stringify(req.body, null, 2)); //from body-parser ReadMe

     var name = req.body.name || '', email = req.body.email || '';
	 var VALID_EMAIL_REGIX = /\S+@\S+\.\S+/;
	 if(!email.match(VALID_EMAIL_REGIX)) {
	  if (req.xhr) res.json({error: "Invalid email"});
	  req.session.flash = {
	  		type: 'danger',
	  		intro: 'validation error',
	  		message: 'the email entered was wrong'
	   };
	   return res.redirect(303, '/newsletter'); // TODO
	 }else {
	 	 if (req.xhr) res.json({error: "Invalid email"});
	        req.session.flash = {
	  		type: 'success',
	  		intro: 'Successful login',
	  		message: 'the email entered was right, enjoy'
	   };
	   return res.redirect(303, '/');
	 }
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