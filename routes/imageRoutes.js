var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var imageController = require('../controllers/imageController.js');

// Routes for image related stuff

/* GET requests */

// Get upload displayPic page
router.get('/uploadDP', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/display-picture-upload.html'));
});

// Get upload artifact image page
/*	!!! PLEASE READ !!!!
		This is currently broken,
		will be fixed when front end for this is completed.
		Using this will just upload the images as an unlinked+untagged images
		To prevent mongo clutter, please refrain from using this for now
		TQVM <3
 */
router.get('/uploadImages', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/artifactImages.html'));
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
// Upload Display Picture
var type = upload.single('pImage');
router.post('/uploadPrimaryImage', type, imageController.uploadPrimaryImage);

type = upload.array('Images', 5);
router.post('/uploadExtraImages', type, imageController.uploadExtraImages);

// Upload Display Picture
type = upload.single('myImage');
router.post('/uploadDP', type, imageController.uploadDisplayPic);

module.exports = router;
