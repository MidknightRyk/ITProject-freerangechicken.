const path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Artifact = require('Artifact');

var register = function(req,res){
    //app.post("/register", function(req,res){
    console.log(req.body.name);

    var user = new User({
          "username":req.body.name,
          "email":req.body.email,
          "approved": false,
          "admin": false
      });

      user.setPassword(req.body.pwd);
      console.log(user);
      return user.save()
        .then(() => res.redirect('/u'));
}

/* login function */
var login = function(req,res){
    passport.authenticate('user', (err, user, info)=>{
        if (err){
          return res.redirect('/');
        }
        if (user){
            console.log(user);
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
            else{
                return res.redirect('/u');
            }
        }
    })(req, res);
}

var addArtifact = function(req,res){

  var artifact = new Artifact({
          "name": req.body.name,
          "description": req.body.description,
          /*imagePath: [{
            primaryImage: String,
            extraImages: { type: [String], default: null }
          }], HELP PLS TQ*/
          "author": req.body.username,
          "tags": req.body.tags,
          "placeOrigin": { type: String, default: null },
          "year": req.body.year,
          "approved": false
  })

  return artifact.save()
}

module.exports.login = login;
module.exports.register = register;
