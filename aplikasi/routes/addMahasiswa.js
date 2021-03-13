var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('addMahasiswa',{title:'Portal Dosen : Tambah Mahasiswa'});
});


module.exports = router;
