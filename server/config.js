module.exports = {
	port: 3000,
	mongoUri: 'mongodb://localhost:27017/templetracker',
	sessionSecret: 'adsfhjbevwbruwrivrebjd',
	facebook: { 
		clientID: '461176754071244',
  		clientSecret: '9e2db698b6ba54e8fd849866a95bf71c',
  		callbackURL: 'http://localhost:3000/auth/facebook/callback',
  		profileFields: ['id', 'displayName', 'photos', 'email']
	}
}
