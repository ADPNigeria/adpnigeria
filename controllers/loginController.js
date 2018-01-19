const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (!req.cookies.user_id)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.layout = 'layout';
	res.render('login', {title: 'Membership'});
});


router.post('/', (req, res) => {
	fetch(process.env.ADDR+'/memberphone/'+req.body.phone_number)
	.then(function(response) {
	  return response.json();
  }).then(function(respo) {
	  if (respo.full_name === req.body.full_name) {
		  req.session.user = respo._id

		 res.cookie('user_id', respo._id, {domain: '.lvh.me'});
		 if (respo.MemberVerified === false) {
			 res.render('login', {login: respo, status: 'success', message: respo.full_name+" You have successfully login, <span class='alert-danger'>Please note that you are yet to pay your membershi due, the system will take you to the payment page.</span> <br>Thank You", title: 'Membership'});
		 } else {
			 res.render('login', {login: respo, status: 'success', message: respo.full_name+" You have successfully login your profile page will soon load", title: 'Membership'});
		 }

	  } else {
		  res.render('login', {login: req.body, status: 'failed', message: req.body.full_name+" Sorry one of input feilds didn't match", title: 'Membership'});
	  }
	});
});

module.exports = router;
