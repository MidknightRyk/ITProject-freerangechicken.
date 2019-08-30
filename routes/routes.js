var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller.js');
var mongoose = require('mongoose');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
const path = require('path');
var Image = mongoose.model('Image');


router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/homepage/homepage.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/profile', function(req,res){
    res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/u', function(req, res){
    res.sendFile(path.join(__dirname+'/../views/awaitingApproval.html'))
});

router.get('/uploadImage', function(req, res){
    res.sendFile(path.join(__dirname+'/../views/fileupload.html'))
});

router.get("/images/:image", function(req,res) {
    Image.findOne({ "name": req.param.image },function(err,images) {

       if (err) return console.log(err)

       //res.set("Content-Type", images.contentType);
       res.send( images.img );
    });
});

router.post('/login', controller.login);

router.post('/register', controller.register);

router.post('/addArtifact', controller.addArtifact);


var type = upload.single('myImage');

router.post('/uploadImage', type, controller.uploadImage);

module.exports = router;
