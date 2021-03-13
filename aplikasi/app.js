var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var simakRouter = require('./routes/simak');
// var tentangRouter = require('./routes/tentang');
var dosenRouter = require('./routes/dosen');
// var loginRouter = require('./routes/login');
var mahasiswaRouter = require('./routes/mahasiswa');
var penghargaanRouter = require('./routes/penghargaan');
var persetujuanRouter = require('./routes/persetujuan');
var krsRouter = require('./routes/rencanaStudy');
var isiKrsRouter = require('./routes/isiKrs');
var addMahasiswaRouter = require('./routes/addMahasiswa');
var editMahasiswaRouter = require('./routes/editMahasiswa');
var deleteMahasiswaRouter = require('./routes/deleteMahasiswa');

var OrientDB = require('orientjs');
var server = OrientDB({
   host:     'localhost',
   port:     2424,
   username: 'root',
   password: '1999'
});
var db = server.use('akademik');

var key;
var param ={
	params:{
		
	}
};
db.query('SELECT * FROM data_mahasiswa',param
	).then(function(data) {
   console.log("======");
   console.log(data);
   console.log('####');
});

// db.update('#17:3')
//    .set({
//       namaLengkap:'new'
//    }).one()
//    .then(
//       function(update){
//          console.log('Records Updated:', update);
//       }
//    );

// Databases listing
server.list()
  .then(list => {
    console.log(list.length + ' databases created so far');

    list.forEach(db => {
      console.log(db.name + ' - ' + db.type);
    });
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/penghargaan', penghargaanRouter);
app.use('/simak', simakRouter);
app.use('/simak/rencanaStudy', krsRouter);
app.use('/simak/rencanaStudy/isiKrs', isiKrsRouter);
// app.use('/simak/biodata', biodataRouter);
app.use('/dosen', dosenRouter);
// app.use('/login', loginRouter);
app.use('/dosen/mahasiswa', mahasiswaRouter);
app.use('/dosen/persetujuan', persetujuanRouter);
app.use('/dosen/add-mahasiswa', addMahasiswaRouter);
app.use('/dosen/edit-mahasiswa', editMahasiswaRouter);
app.use('/dosen/delete-mahasiswa', deleteMahasiswaRouter);

// create rencana study
app.post('/isikrs', (req, res) => {
	var sbd = req.body.sbd;
	var psbd = req.body.psbd;
	var nim =1187050003;
	var nama ='Ade Nurjaman';
	var status ='Tunggu';

	var sql = 'INSERT INTO rencanaStudy (nim,nama,status,matkul1, matkul2) VALUES(:nim, :nama, :status, :sbd, :psbd)';
	db.query(sql,
		{params:{
			nim:nim,
			nama:nama,
			status:status,
			sbd:sbd,
			psbd:psbd
		}
	}).then(function(results){
		res.redirect('/simak/rencanaStudy/');
	});
  console.log(req.body);
});
// setujui krs
app.post('/dosen/persetujuan/:id/setuju', function(req, res){
	var sql = 'UPDATE rencanaStudy SET status=:status WHERE @rid=:rid';
	var id = req.params.id;
	var status ='disetujui';

	db.query(sql,{
		params:{
			status:status,
			rid:id
		}
	}).then(function(results){
		console.log('<<disetujui>>');
		res.redirect('/dosen/persetujuan/');
	});
});
// ditolak krs
app.post('/dosen/persetujuan/:id/tolak', function(req, res){
	var sql = 'UPDATE rencanaStudy SET status=:status WHERE @rid=:rid';
	var id = req.params.id;
	var status ='TOLAK';

	db.query(sql,{
		params:{
			status:status,
			rid:id
		}
	}).then(function(results){
		console.log('<<disetujui>>');
		res.redirect('/dosen/persetujuan/');
	});
});
app.post('/dosen/persetujuan/:id/reset-krs', function(req,res){
	var id = req.params.id;

	db.delete('VERTEX','rencanaStudy')
   .where('@rid = '+id).one()
   .then(
      function(del){
         console.log('Reset KRS: ' + del);
         res.redirect('/dosen/persetujuan');
      });

});


// edit data_mahasiswa
app.post('/dosen/edit-mahasiswa/:id/edit', function(req, res){
	var sql = 'UPDATE data_mahasiswa SET nim=:nim, namaLengkap=:namaLengkap, alamat=:alamat, tahunDiterima=:tahunDiterima, jurusan=:jurusan,fakultas=:fakultas WHERE @rid=:rid';
	var id = req.params.id;
	var nim = req.body.nim;
	var namaLengkap = req.body.namaLengkap;
	var alamat = req.body.alamat;
	var tahunDiterima = req.body.tahunDiterima;
	var jurusan = req.body.jurusan;
	var fakultas = req.body.fakultas;

	db.query(sql,{
		params:{
			nim:nim,
			namaLengkap:namaLengkap,
			alamat:alamat,
			tahunDiterima:tahunDiterima,
			jurusan:jurusan,
			fakultas:fakultas,
			rid:id
		}
	}).then(function(results){
		console.log('Edit>>');
		res.redirect('/dosen/mahasiswa/');
	});
});
// delete data_mahasiswa
app.post('/dosen/delete-mahasiswa/:id/delete', function(req,res){
	// var sql = 'DELETE FROM data_mahasiswa WHERE nim=:nim';
	var id = req.params.id;
	// console.log(nim);
	
	db.delete('VERTEX','data_mahasiswa')
   .where('@rid = '+id).one()
   .then(
      function(del){
         console.log('Records Deleted: ' + del);
         res.redirect('/dosen/mahasiswa');
      }   
   );
	
});
app.post('/dosen/add-mahasiswa/create', function(req, res){
	var nim = req.body.nim;
	var namaLengkap = req.body.namaLengkap;
	var alamat = req.body.alamat;
	var tahunDiterima = req.body.tahunDiterima;
	var jurusan = req.body.jurusan;
	var fakultas = req.body.fakultas;
	
	var sql = 'INSERT INTO data_mahasiswa (nim,namaLengkap,alamat,tahunDiterima,jurusan,fakultas) VALUES(:nim,:namaLengkap, :alamat, :tahunDiterima, :jurusan,:fakultas)';
	db.query(sql,
		{params:{
			nim:nim,
			namaLengkap:namaLengkap,
			alamat:alamat,
			tahunDiterima:tahunDiterima,
			jurusan:jurusan,
			fakultas:fakultas
		}
	}).then(function(results){
		console.log('Create Sukses');
		res.redirect('/dosen/mahasiswa/'+encodeURIComponent(results[0]['@rid']));
	});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
