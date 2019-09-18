const express = require('express');
var path = require('path');
var router = express.Router();
var adminController = require('../controllers/adminController.js');

// admin specific routes
// Access but typing culturechive.herokuapp.com/admin/{page you want}
router.get('', function (req, res) {
	if (req.session.userType === 'admin') {
		return adminController.adminPage;
	} else {
		res.sendFile(path.join(__dirname, '/../views/adminPage.html'));
	}
});

// Admin Approval Homepage
router.get('/homepage', adminController.adminPage);

router.post('/user-approve', adminController.userApprove);

router.post('/user-delete', adminController.userDelete);

router.post('/arti-approve', adminController.artiApprove);

router.post('/arti-delete', adminController.artiDelete);

module.exports = router;
