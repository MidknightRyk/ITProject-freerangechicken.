const fs = require('fs');
var storage = require('sessionstorage');
const path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var Image = mongoose.model('Image');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');

var register = function(req,res){
    User.findOne({ email: req.body.email }).then(function(user){
        if (user) {
            return res.status(400).send('That user already exisits!');
        }
        else {
            User.findOne({username: req.body.name}).then(function(name){
                if (name){
                    return res.status(400).send('Username taken!');
                }
                else{
                    var user = new User({
                        "username":req.body.name,
                        "email":req.body.email,
                        "approved": false,
                        "admin": false
                    });
                    user.setPassword(req.body.pwd);
                    return user.save()
                    .then(() => res.redirect('/u'));
                }
            });
        }
    });

}

/* login function */
var login = function(req,res){
    passport.authenticate('user', (err, user, info)=>{
        if (err){
            return res.redirect('/');
        }
        if (user){
            if (user.approved){
                req.session.user = user._id;
                if (user.admin){
                    req.session.userType = 'admin';
                }
                else{
                    req.session.userType = 'user';
                }
                return res.redirect('/profile');
            }
        }
        else{
            return res.redirect('/u');
        }
    })(req, res);
}

var addArtifact = function (req, res) {
	console.log(req.body);
	var artifact = new Artifact({
		'name': req.body.name,
		'description': req.body.description,
		'author': req.body.username,
		'tags': req.body.tags,
		'placeOrigin': req.body.country,
		'year': req.body.year,
		'approved': false
	});

	artifact.save();
	storage.artifactId = artifact._id;
	console.log(artifact._id);
	return res.redirect('/uploadImage');
};

var getArtifact = function (req, res) {
	console.log(req.params.artifact);
	Artifact.find({'_id': ObjectID(req.params.artifact)}, function (err, artifact) {
		if (err) return console.log(err);

		console.log(req.params.artifact);
		res.send(artifact.data);
	});
};

var uploadImage = function (req, res) {
	var imgname = req.file.originalname;
	var artifactID = storage.artifactId;
	console.log('Updating Images for artifact' + artifactID);

	var image = new Image({
		'name': imgname,
		'data': fs.readFileSync(req.file.path),
		'contentType': req.file.mimetype,
		'artifactID': artifactID
	});

	if (req.body.imageType === 'primaryImage') {
		console.log('Updating Primary Image');
		Artifact.findOneAndUpdate(
			{ '_id': artifactID.toString() },
			{ 'primaryImage': imgname },
			{ upsert: true }, function (err, artifact) {
				if (err) return console.log('couldnt update database');

				console.log(artifact.name);
			}
		);
	} else if (req.body.imageType === 'extraImage') {
		console.log('Updating Extra Images');
		Artifact.findOneAndUpdate(
			{ '_id': artifactID.toString() },
			{ $push: { 'extraImages': imgname } }
		);
	}

	console.log('Image ' + req.file.originalname + 'has been uploaded!');
	return image.save()
		.then(() => res.redirect('/u'));
};

var getImage = function (req, res) {
	Image.findOne({ 'name': req.params.image }, function (err, images) {
		if (err) return console.log(err);

		console.log(req.params.image);
		res.contentType(images.contentType);
		res.send(images.data);
	});
};

var addArtifact = function(req,res){
    var artifact = new Artifact({
        "name": req.body.name,
        "description": req.body.description,
        "author": req.body.username,
        "tags": req.body.tags,
        "placeOrigin": { type: String, default: null },
        "year": req.body.year,
        "approved": false
    })

    return artifact.save()
    .then(() =>{
        User.findOneAndUpdate(
            {_id: ObjectId(req.session.user)},
            {$push: {artifacts: artifact._id}},
            function (err, success) {
                if (err) {
                    return res.sendStatus(400);
                }
                else{
                    res.redirect('/profile');
                }
            }
        );
    });
}


var uploadImage = function(req, res){

    var image = new Image({
        "name": req.file.originalname,
        "data": fs.readFileSync(req.file.path),
        "contentType": req.file.mimetype
    });
    console.log("Image " + req.file.originalname + "has been uploaded!")
    return image.save()
    .then(() => res.redirect('/u'));

};

var getImage = function(req,res) {
    Image.findOne({ "name": req.params.image },function(err,images) {

        if (err) return console.log(err)

        console.log(req.params.image)
        res.contentType(images.contentType);
        res.send( images.data );
    });
};

var profile = function(req, res){
    User.findById(ObjectId(req.session.user))
    .populate({ path: 'artifacts', model: Artifact })
    .exec((err,user) =>{
        res.render(path.join(__dirname+'/../views/profile-page/profile-page.pug'),{user:user,  artifacts: user.artifacts});
    })
}

module.exports.profile = profile;
module.exports.login = login;
module.exports.register = register;
module.exports.addArtifact = addArtifact;
module.exports.uploadImage = uploadImage;
module.exports.getImage = getImage;
module.exports.getArtifact = getArtifact;
