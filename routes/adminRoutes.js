const express = require('express');
var router = express.Router();
var path = require('path');
var adminController = require('../controllers/adminController.js');

/* Admin Access: Restricted to users with admin privlleges
 * (i cnt spell pls forgib)
 */

/* GET requests */

// Access by typing culturechive.herokuapp.com/admin/{page you want}
router.get('/', adminController.adminPage);

// No Access Page
router.get('/no-access', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/admin-page/no-access.html'));
});

/* POST requests */

// User approval
router.post('/user-approve', adminController.userApprove);

// User delete
router.post('/user-delete', adminController.userDelete);

// Artifact approve
router.post('/arti-approve', adminController.artiApprove);

// Artifact delete
router.post('/arti-delete', adminController.artiDelete);

module.exports = router;
