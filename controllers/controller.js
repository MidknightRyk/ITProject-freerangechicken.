const path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

var register = function(req,res){
    var user = new User({
          "username":req.body.name,
          "email":req.body.email,
          "approved": false,
          "admin": false
      });

      user.setPassword(req.body.pwd);
      return user.save()
        .then(() => res.sendFile(path.join(__dirname+'/../views/awaitingApproval.html')));
}

/* login function */
var login = function(req,res){
    User.find({'email':req.body.email}, function(err, user){
      if (!err){
          passport.authenticate('local', (err, user, info)=>{
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
                  else{
                      return alert("Sorry, your account hasn't been approved!");
                  }
              }
          })(req, res, next);
      }
  })
}

module.exports.login = login;
module.exports.register = register;
