var express = require('express'),
	expressSession = require('express-session'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	facebookStrategy = require('passport-facebook').Strategy,
	googleStrategy = require('passport-google').Strategy,
	config = require('./config');

var app =express(),
	port = config.port;

var mongoUri = config.mongoUri;

mongoose.set('debug', true);
mongoose.connect(mongoUri);
mongoose.connection.once('open', function() {
  console.log('connected to mongoDB at: ', mongoUri);
});

// middleware
app.use(bodyParser.json());
app.use(express.static(__dirname+ '/../public'));
app.use(expressSession({
	secret: config.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new facebookStrategy(config.facebook, function(token, refreshToken, profile, done) {
	// connect to our database
	// console.log(profile);

	// to check for a user
	UsersModel.findOne({
		'login.facebook': profile.id
	}, function(err, result) {
		if (err) {
			return done(err, false);
		}
		else if (result) {
			return done(null, result);
		}
		else {
			var tempNewUser = {
				name: profile.displayName, 
				// email: profile.email, get certified then change to what facebook gives you
				login: {
					facebook: profile.id
				},
				userProfileImage: profile.photos[0].value
			};
			var newUser = new UsersModel(tempNewUser)
			newUser.save(function(err, saveResult) {
				if(err) {
					return done(err, false) 
				}
				else {
					return done(null, saveResult)
					aUser = saveResult
				}
			})
		}
	})

}));

 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
	// console.log(obj);
  done(null, obj);

});

// facebook login endpoint
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	// ******* ADD THE VIEWS WE WANT TO REDIRECT *******
	successRedirect: '/#/',
	failureRedirect: '/#/'
}));

app.get('/auth/current', function (req, res) {
	if(req.isAuthenticated()) {
		res.json(req.user);
	} else {
		res.sendStatus(401);
	}
});

app.get('/auth/logout', function (req, res) {
	req.logout();
	// ******* ADD THE VIEWS WE WANT TO REDIRECT *******
	res.redirect('/#/');
	console.log('logout now')
});


// GOOGLE STRATEGY



// ENPOINTS FOR FRONT END



// Making sure the server is running. 

app.listen(port, function() {
	console.log('Server is running on port ' + port);
});