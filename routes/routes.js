var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController.js');
var imageController = require('../controllers/imageController.js');
var artifactController = require('../controllers/artifactController.js');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const path = require('path');

router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/homepage/homepage.html'));
  // dirname : It will resolve to your project folder.
});

// Get Profile Page
router.get('/profile', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/index.html'));
});

// Get require admin approval page
router.get('/u', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/awaitingApproval.html'));
});

router.get('/profile', loginController.profile);

// Get upload image page
router.get('/uploadImage', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/fileupload.html'));
});

// Get add Artifact page
router.get('/addArtifact', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/addArtifact.html'));
});

// Get images
router.get('/images/:image', imageController.getImage);

// Get artifacts by id
router.get('/aritfacts/:artifact', artifactController.getArtifact);

// Login
router.post('/login', loginController.login);

// Register
router.post('/register', loginController.register);

// Add Artifact
router.post('/addArtifact', artifactController.addArtifact);

// Upload Image
var type = upload.single('myImage');

router.post('/uploadImage', type, imageController.uploadImage);

module.exports = router;
