const express = require('express');
const router = express.Router();

const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'EXPRESS-CINEMA', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

//const sqlString = 'mssql://' + config.user + ':' + config.password + '@' + config.server + '/' + config.database;

// OBTIENE LA LISTA DE ASIENTOS DE UNA SALA
router.get("/asientos", async(req,res)=>{
	const sql = require('mssql')
	
	let codsala = Number(req.query.codsala);
	//let token = req.query.token;

	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CINEMA_ASIENTOS.CODASIENTO, CINEMA_ASIENTOS.CODIGO, CINEMA_ASIENTOS.DESCRIPCION, CINEMA_ASIENTOS.CODSALA, CINEMA_SALAS.DESSALA, CINEMA_ASIENTOS.CODUBICACION, 
								CINEMA_UBICACIONES.DESUBICACION, CINEMA_ASIENTOS.OCUPADO, CINEMA_ASIENTOS.FILA, CINEMA_ASIENTOS.COORDS
								FROM CINEMA_ASIENTOS LEFT OUTER JOIN
								CINEMA_UBICACIONES ON CINEMA_ASIENTOS.CODUBICACION = CINEMA_UBICACIONES.CODUBICACION LEFT OUTER JOIN
								CINEMA_SALAS ON CINEMA_ASIENTOS.CODSALA = CINEMA_SALAS.CODSALA
								WHERE (CINEMA_ASIENTOS.CODSALA=${codsala})`

				console.dir('Enviando listado de asientos');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// OBTIENE EL LISTADO DE LAS SALAS
router.get("/salas", async(req,res)=>{
	const sql = require('mssql')
	
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CODSALA, DESSALA, IMG FROM CINEMA_SALAS`

				console.dir('Enviando listado de salas');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// OCUPA UN ASIENTO
router.put("/ocupar", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let codasiento = Number(req.body.codasiento);
			
	let sqlQry = `UPDATE CINEMA_ASIENTOS SET OCUPADO='SI' WHERE CODASIENTO=${codasiento}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Asiento ocupado...')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log('Error al finalizar: ' + err)
		})
});

// DESOCUPA UN ASIENTO
router.put("/desocupar", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let noasiento = Number(req.body.codasiento);
			
	let sqlQry = `UPDATE CINEMA_ASIENTOS SET OCUPADO='NO' WHERE CODASIENTO=${noasiento}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Asiento desocupado...')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log('Error al finalizar: ' + err)
		})
});

// DESOCUPAR TODOS LOS ASIENTOS OCUPADOS
router.put("/desocupartodos", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let codsala = Number(req.body.codsala);

				console.log('hasta aqui todo bien s: ' + codsala)
				
	let sqlQry = `UPDATE CINEMA_ASIENTOS SET OCUPADO='NO' WHERE CODSALA=${codsala}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Todos los asientos desocupados...')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log('Error al finalizar: ' + err)
		})
});

// LOGIN
router.get("/usuarios", async(req,res)=>{
	const sql = require('mssql')
	
	let user = req.query.user;
	let pass = req.query.pass;

	
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT NOMBRE,NIVEL FROM USUARIOS WHERE NOMBRE=${user} AND CLAVE=${pass}`
				res.send(result);
				console.log('login: ' + result)
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});


module.exports = router;