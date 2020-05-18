var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});
var imageController = require('../controllers/imageController.js');

// Routes for image related stuff

/* GET requests */

// Get upload displayPic page
router.get('/upload-DP', function (req, res) {
  res.sendFile(path.join(__dirname, '/../views/image-uploads/display-picture-upload.html'));
});

// Get upload artifact image page
/*	!!! PLEASE READ !!!!
		This is currently broken,
		will be fixed when front end for this is completed.
		Using this will just upload the images as an unlinked+untagged images
		To prevent mongo clutter, please refrain from using this for now
		TQVM <3
 */
router.get('/upload-images', function (req, res) {
  res.sendFile(path.join(__dirname, '/../views/FountainImages.html'));
});

/* !!!! ATTENTION: Add new get pages before this comment !!!
 * If you do not heed the warning,
 * you gon objectid error
 * YOU HAVE BEEN WARNED
 */

// Get images
router.get('/:image', imageController.getImage);

/* POSTS requests */

// upload mutliple pictures (For artifacts)
var type = upload.array('pro-image', 5);
router.post('/upload-images', type, imageController.uploadImages);

// Reupload photos for Artifacts
router.post('/reupload-images', type, imageController.reuploadImages);

// Upload Display Picture
type = upload.single('myImage');
router.post('/upload-DP', type, imageController.uploadDisplayPic);

module.exports = router;
