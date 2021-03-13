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
	var id = '#17:9';
	db.query('SELECT * FROM data_mahasiswa',
		{params:{
			rid:id
		}}
	).then(function(data) {
   console.log("======");
   console.log(data);
   res.render('simak', {title:'Sistem Akademik : Dashboard', data:data[0]});
});
		
});

module.exports = router;
