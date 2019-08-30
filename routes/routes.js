var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller.js');
var mongoose = require('mongoose');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
const path = require('path');


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

router.get('/photos', (req, res) => {
  db.collection('images').find().toArray((err, result) => {

        const imgArray= result.map(element => element._id);
              console.log(imgArray);

     if (err) return console.log(err)
     res.send(imgArray)

    })
});

router.post('/login', controller.login);

router.post('/register', controller.register);

router.post('/addArtifact', controller.addArtifact);

/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })
*/

var type = upload.single('myImage');

router.post('/uploadImage', type, controller.uploadImage);

module.exports = router;
