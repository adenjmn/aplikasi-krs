var express = require('express');
var router = express.Router();

var OrientDB = require('orientjs');
var server = OrientDB({
   host:     'localhost',
   port:     2424 ,
   username: 'root',
   password: '1999'
});
var db = server.use('akademik');

router.get('/:id', function(req, res, next) {
	var sql = 'SELECT FROM data_mahasiswa';
	var id = req.params.id;
	db.query(sql).then(function(data_){
		var sql = 'SELECT FROM data_mahasiswa WHERE @rid=:rid';
		db.query(sql, {params:{rid:id}}).then(function(data){
			console.log('edit jalan');
			console.log(id);
			res.render('editMahasiswa', {data_:data_, data:data[0]});
		});
	});
});


module.exports = router;