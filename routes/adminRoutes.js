const express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController.js');

/* Admin Access: Restricted to users with admin privlleges
 * (i cnt spell pls forgib)
 */

/* GET requests */

// Access but typing culturechive.herokuapp.com/admin/{page you want}
router.get('/', adminController.adminPage);

// Admin Approval Homepage
router.get('/homepage', adminController.adminPage);

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
