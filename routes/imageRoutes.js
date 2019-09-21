var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var imageController = require('../controllers/imageController.js');

// Routes for image related stuff

// GET requests

// Get upload image page
router.get('/uploadImage', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/fileupload.html'));
});

// Upload Image
var type = upload.single('myImage');
router.post('/uploadImage', type, imageController.uploadImage);

// Get images
router.post('/:image', imageController.getImage);

module.exports = router;
