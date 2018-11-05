const express=require('express');
const router=express.Router();
const userModel=require('../model/model');
const async=require('async');
const crypto=require('crypto');



router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            userModel.findOne({ email: req.body.data.user.email }, function (err, user) {
              if(err){
                 next(err)
              }
             else if (!user) {
                  res.json({ success: false, message: "No account with that email address exists." });
                } else {

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            }
            });
        },
        function (token, user, done) {
            res.json({success: true});
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                        user: 'accionlabs136@gmail.com',
                        pass: 'accion136'
                }
            });
            var mailOptions = {
                to: req.body.data.user.email,
                from: 'accionlabs136@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + 'localhost:4200/forgot' + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err,res) {
               if(err){
                   console.log('Error',err);
               } else{
                  res.json({success:true,message:'Email Sent'})
               }
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        res.json({ success: false, message: "Password reset token is invalid or has expired"});
        }
    });
});
  

  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if(err){
            next(err);
          } else if (!user) {
             res.json({success:false, message:'Password reset token is invalid or has expired.'});
          } else {
            user.password = req.body.data.user.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            
            user.save(function (err) {
                done(err,user);    
          });
            user=user.email
            res.json({success: true, message:'Your password has been updated.'});
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport( {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            auth:  {
            user: 'accionlabs136@gmail.com',
            pass: 'accion136'
          }
        });
        var mailOptions = {
          to: user,
          from: 'accionlabs136@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err,res) {
            if(err){
                console.log('Error',err);
            } else{
                console.log('Email Sent');
            }
        });
      }
    ],);
  });