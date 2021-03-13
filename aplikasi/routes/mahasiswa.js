var express = require('express');
var router = express.Router();
// var conn = require('../config/connection');
var OrientDB = require('orientjs');
var server = OrientDB({
   host:     'localhost',
   port:     2424,
   username: 'root',
   password: '1999'
});
var db = server.use('akademik');

router.get(['/','/:id'], function(req, res, next) {
	var sql = 'SELECT FROM data_mahasiswa';
	db.query(sql).then(function(data_){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT FROM data_mahasiswa WHERE @rid=:rid';
			db.query(sql, {params:{rid:id}}).then(function(data){
				console.log(data);
				res.render('mahasiswa', {title:'Portal Dosen : Daftar Mahasiswa',data_:data_, data:data[0]});
			});			
		}else{
			res.render('mahasiswa',{title:'Portal Dosen : Daftar Mahasiswa',data_:data_});
		}
		// console.log(data[0]);
	 	// res.render('mahasiswa',{title:'Portal Dosen : Daftar Mahasiswa',data:data[0]});
	});
	// res.render('mahasiswa', {data_mahasiswa:data_mahasiswa});
});


module.exports = router;
