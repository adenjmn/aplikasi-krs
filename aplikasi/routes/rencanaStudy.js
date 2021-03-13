var express = require('express');
var router = express.Router();

var OrientDB = require('orientjs');
var server = OrientDB({
   host:     'localhost',
   port:     2424,
   username: 'root',
   password: '1999'
});
var db = server.use('akademik');

router.get('/', function(req, res, next) {
	var sql = 'SELECT FROM rencanaStudy';
	db.query(sql).then(function(rencanaStudy){
	 	res.render('krs',{title:'Sistem Akademik : Rencana Study',rencanaStudy:rencanaStudy[0]});
	});
});


module.exports = router;
