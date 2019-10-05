var express = require('express');
var router = express.Router();
var path = require('path');
var loginController = require('../controllers/loginController.js');
var userController = require('../controllers/userController.js');
var admin = require('./adminRoutes.js');
var artifactRoute = require('./artifactRoutes.js');
var discus = require('./discussionRoutes.js');
var image = require('./imageRoutes.js');

// External routes
router.use('/admin', admin);
router.use('/artifacts', artifactRoute);
router.use('/discussion-board', discus);
router.use('/images', image);

/* GET Requests */

// Get homepage
router.get('/', function (req, res) {
	if (!req.session.user) {
		res.sendFile(path.join(__dirname, '/../views/homepage/homepage.html'));
	} else {
		res.redirect('/catalogue');
	}
  // dirname : It will resolve to your project folder.
});

// Get wait for admin approval page
router.get('/u', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/awaiting-approval-page/awaiting-approval-page.html'));
});

// Get catalogue page
router.get('/catalogue', userController.catalogue);

// Get logout page????
router.get('/logout', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/homepage/logout.html'));
});

// Get profile page
router.get('/profile', loginController.profile);

// Get edit profile page?
router.get('/edit-profile', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/editProfile/editProfile.html'));
});

/* POST requests */

// Login
router.post('/login', loginController.login);

// Logout
router.post('/logout', loginController.logout);

// Register
router.post('/register', loginController.register);

// Edit profile
router.post('/edit-profile', userController.editProfile);

module.exports = router;
