const express = require('express');
const router = express.Router();

const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'EXPRESS-CINEMA', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};


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

// INSERTA UN REGISTRO EN LA TABLA CARTELERA
router.post("/nuevapelicula", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	
	let _anio = Number(req.body.anio);
	let _mes = Number(req.body.mes);
	let _dia = Number(req.body.dia);
	let _hora = req.body.hora;
	let _minuto = req.body.minuto;
	let _horaf = req.body.horafin;
	let _minutof = req.body.minutofin;
	let _titulo = req.body.titulo;
	let _codsala = Number(req.body.codsala);
		
	let sqlQry = `INSERT INTO CINEMA_CARTELERA (ANIO,MES,DIA,HORA,MINUTO,HORAFIN,MINUTOFIN,TITULO,CODSALA) 
				  VALUES (${_anio},${_mes},${_dia},'${_hora}','${_minuto}','${_horaf}','${_minutof}','${_titulo}',${_codsala})`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)			
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Nueva pelicula agregada...')
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


// OBTIENE TODAS LAS PELÍCULAS EN CARTELERA
router.get("/cartelera", async(req,res)=>{
	const sql = require('mssql')
	
	let _anio = req.query.anio;
	let _mes = req.query.mes;
	let _dia = req.query.dia;

	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CINEMA_CARTELERA.ID, CINEMA_CARTELERA.ANIO, CINEMA_CARTELERA.MES, CINEMA_CARTELERA.DIA, CINEMA_CARTELERA.HORA, CINEMA_CARTELERA.MINUTO, CINEMA_CARTELERA.HORAFIN, CINEMA_CARTELERA.MINUTOFIN, CINEMA_CARTELERA.TITULO,CINEMA_CARTELERA.CODSALA, CINEMA_SALAS.DESSALA
											FROM CINEMA_CARTELERA LEFT OUTER JOIN CINEMA_SALAS ON CINEMA_CARTELERA.CODSALA = CINEMA_SALAS.CODSALA`
				//WHERE (CINEMA_CARTELERA.ANIO = ${_anio}) AND (CINEMA_CARTELERA.MES = ${_mes}) AND (CINEMA_CARTELERA.DIA = ${_dia})
				res.send(result);
				console.log('cartelera enviada exitosamente')
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// EDITA UNA PELICULA
router.put("/editarpelicula", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let _id = Number(req.body.id);
	let _hora = req.body.hora;
	let _minuto = req.body.minuto;
	let _horaf = req.body.horafin;
	let _minutof = req.body.minutofin;
	let _titulo = req.body.titulo;
	let _codsala = Number(req.body.codsala);
				
	let sqlQry = `UPDATE CINEMA_CARTELERA SET TITULO='${_titulo}',HORA='${_hora}',MINUTO='${_minuto}',HORAFIN='${_horaf}',MINUTOFIN='${_minutof}',CODSALA=${_codsala}  WHERE ID=${_id}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Pelicula editada exitosamente..')
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

// ELIMINA UNA PELICULA
router.put("/pelicula", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let _id = Number(req.body.id);
				
	let sqlQry = `DELETE FROM CINEMA_CARTELERA WHERE ID=${_id}`
		
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Pelicula eliminada de cartelera..')
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

module.exports = router;