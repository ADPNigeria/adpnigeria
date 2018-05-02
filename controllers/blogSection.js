const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const moment = require('moment');
const Feed = require('rss-to-json');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('blog', {title: 'Blog'})
});

router.get('/getThem', (req, res) => {
    request('https://medium.com/feed/action-democratic-party', function (error, response, body) {
        res.send(body)
      })
    // fetch('https://medium.com/feed/action-democratic-party')
    // .then(res => res.buffer())
	// .then(buffer => fileType(buffer))
    // .then(type => { /* ... */ });
});

module.exports = router;
