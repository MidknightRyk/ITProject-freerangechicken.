// Set up express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('cookie-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));
app.use(session({
	secret: 'itproject',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secureProxy: true,
		httpOnly: true
	}
}));

// Database setup
require('./models/db.js');
require('./config/passport.js');

// Passport setup
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/routes.js');
var adminRouter = require('./routes/adminRoutes.js');

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/admin', adminRouter);
app.use('/', routes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log(`Express listening on port ${PORT}`);
});
