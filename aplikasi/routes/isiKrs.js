var express = require('express');
var router = express.Router();

var OrientDB = require('orientjs');
var server = OrientDB({
   host:     'localhost',
   port:     2480,
   username: 'root',
   password: '1999'
});
var db = server.use('akademik');

router.get('/', function(req, res, next) {
	res.render('isiKrs', { title: 'SISTEM AKADEMIK : ISI KRS' });
});


module.exports = router;
