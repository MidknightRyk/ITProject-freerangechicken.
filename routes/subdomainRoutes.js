const express = require('express');
var router = express.Router();
var subdomainController = require('../controllers/subdomainController.js');

// admin specific routes
router.get('/', function (req, res) {
	if (req.session.userType === 'admin') {
		return subdomainController.adminPage;
	} else {
		res.redirect(401, req.header('host').replace('admin.', ''));
	}
});

// Admin Approval Homepage
router.get('/homepage', subdomainController.adminPage);

router.post('/user-approve', subdomainController.userApprove);

router.post('/user-delete', subdomainController.userDelete);

router.post('/arti-approve', subdomainController.artiApprove);

router.post('/arti-delete', subdomainController.artiDelete);

// prob need a subdomain controller too

module.exports = router;
