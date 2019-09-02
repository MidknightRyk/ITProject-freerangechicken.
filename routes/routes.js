var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller.js');
var multer = require('multer');
var upload = multer({
	dest: 'uploads/'
});
const path = require('path');

router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/homepage/homepage.html'));
  // dirname : It will resolve to your project folder.
});

router.get('/profile', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/index.html'));
});

router.get('/u', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/awaitingApproval.html'));
});

router.get('/uploadImage', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/fileupload.html'));
});

router.get('/addArtifact', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/addArtifact.html'));
});

router.get('/images/:image', controller.getImage);

router.get('/aritfacts/:artifact', controller.getArtifact);

router.post('/login', controller.login);

router.post('/register', controller.register);

router.post('/addArtifact', controller.addArtifact);

var type = upload.single('myImage');

router.post('/uploadImage', type, controller.uploadImage);

module.exports = router;
