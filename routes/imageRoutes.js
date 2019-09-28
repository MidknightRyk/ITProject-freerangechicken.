var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var imageController = require('../controllers/imageController.js');

// Routes for image related stuff

// GET requests

// Get upload image page
router.get('/uploadDP', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/display-picture-upload.html'));
});

// Get upload image page
router.get('/uploadImages', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/multifiletest.html'));
});

// Get images
router.get('/:image', imageController.getImage);

// POSTS requests

// upload mutliple pictures
var type = upload.array('Images', 5);
router.post('/uploadImages', type, imageController.uploadImages);

// Upload Display Picture
type = upload.single('myImage');
router.post('/uploadDP', type, imageController.uploadDisplayPic);

module.exports = router;
