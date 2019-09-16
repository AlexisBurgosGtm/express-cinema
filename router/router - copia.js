const express = require('express');
const router = express.Router();

//const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'EXPRESS-CINEMA', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

// OBTIENE LA LISTA DE ASIENTOS DE UNA SALA
router.get("/asientos", async(req,res)=>{
	const sql = require('mssql')
	
	let codsala = Number(req.query.codsala);
	let pelicula = req.query.pelicula;
	let horainicio = req.query.horainicio;
	let minutoinicio = req.query.minutoinicio;
	let fecha = req.query.fecha;

	console.log(pelicula);
	console.log(horainicio + '-' + minutoinicio);
	console.log(fecha);

	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT FECHA, PELICULA, NOSALA, NOASIENTO, NOFILA, HORAINICIO, MINUTOINICIO, HORAFIN, MINUTOFIN
											FROM CINEMA_ORDERS 
											WHERE (PELICULA=${pelicula}) AND (NOSALA = ${codsala}) 
											AND (HORAINICIO =${horainicio}) 
											AND (MINUTOINICIO =${minutoinicio}) 
											AND (FECHA = ${fecha})`

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

	let nosala = Number(req.body.nosala);
	let codasiento = Number(req.body.codasiento);
	let codfila = Number(req.body.codfila);
	
	let pelicula = req.body.pelicula;
	let fecha = req.body.fecha;
	let horainicio = req.body.horainicio;
	let minutoinicio = req.body.minutoinicio;
	let coddoc = req.body.coddoc;
	let correlativo = Number(req.body.correlativo);
	let empnit = req.body.empnit;
			
	let sqlQry = `INSERT INTO CINEMA_ORDERS 
					(EMPNIT,CODDOC,CORRELATIVO,NOSALA,FECHA,PELICULA,NOASIENTO,NOFILA,HORAINICIO,MINUTOINICIO) VALUES 
					('${empnit}','${coddoc}',${correlativo},${nosala},'${fecha}','${pelicula}',${codasiento},${codfila},'${horainicio}','${minutoinicio}')`
		
					//console.log(sqlQry);
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)
			//pool1.request() // or: new sql.Request(pool1)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					//res.send('Asiento ocupado...')
					console.log('asiento ocupado ' & codasiento)
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
	
	let nosala = Number(req.body.nosala);
	let codasiento = Number(req.body.codasiento);
	let codfila = Number(req.body.codfila);
	
	let pelicula = req.body.pelicula;
	let fecha = req.body.fecha;
	let horainicio = req.body.horainicio;
	let minutoinicio = req.body.minutoinicio;

	console.log('solicitando desocupar asiento.. ' + codasiento);
			
	let sqlQry = `DELETE FROM CINEMA_ORDERS WHERE NOSALA=${nosala} AND FECHA='${fecha}' AND PELICULA='${pelicula}' AND NOASIENTO=${codasiento} AND NOFILA=${codfila} AND HORAINICIO='${horainicio}' AND MINUTOINICIO='${minutoinicio}'`
		//console.log(sqlQry);

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

// LOGIN
router.get("/usuarios", async(req,res)=>{
	const sql = require('mssql')
	
	//let user = req.query.user;
	let pass = req.query.pass;

	
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			//const result = await sql.query `SELECT NOMBRE,NIVEL FROM USUARIOS WHERE NOMBRE=${user} AND CLAVE=${pass}`
			const result = await sql.query `SELECT NOMBRE,NIVEL FROM USUARIOS WHERE CLAVE=${pass}`
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
	let _fecha =  req.body.fecha;
	let _fechaFin =  req.body.fechaFin;
	
		
	let sqlQry = `INSERT INTO CINEMA_CARTELERA (FECHA,FECHAINICIO,FECHAFIN,ANIO,MES,DIA,HORA,MINUTO,HORAFIN,MINUTOFIN,TITULO,CODSALA,ACTIVA) 
				  VALUES ('${_fecha}','${_fecha}','${_fechaFin}',${_anio},${_mes},${_dia},'${_hora}','${_minuto}','${_horaf}','${_minutof}','${_titulo}',${_codsala},'SI')`

						
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
router.get("/cartelerafecha", async(req,res)=>{
	const sql = require('mssql');
	
	
	let _dia = req.query.dia;
	let _mes = req.query.mes;
	let _anio = req.query.anio;
	let _fecha =   _anio + '/' + _mes + '/' + _dia
	
	console.log('solicitando cartelera fecha ' + _fecha)

	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CINEMA_CARTELERA.ID, CINEMA_CARTELERA.FECHA, CINEMA_CARTELERA.FECHAINICIO, CINEMA_CARTELERA.FECHAFIN, CINEMA_CARTELERA.ANIO, CINEMA_CARTELERA.MES, CINEMA_CARTELERA.DIA, CINEMA_CARTELERA.HORA, CINEMA_CARTELERA.MINUTO, CINEMA_CARTELERA.HORAFIN, CINEMA_CARTELERA.MINUTOFIN, CINEMA_CARTELERA.TITULO,CINEMA_CARTELERA.CODSALA, CINEMA_SALAS.DESSALA
											FROM CINEMA_CARTELERA LEFT OUTER JOIN CINEMA_SALAS ON CINEMA_CARTELERA.CODSALA = CINEMA_SALAS.CODSALA
											WHERE (CINEMA_CARTELERA.FECHA <= ${_fecha}) ORDER BY CINEMA_CARTELERA.HORA`
				res.send(result);
				console.log('cartelera enviada exitosamente')
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// OBTIENE TODAS LAS PELÍCULAS EN CARTELERA
router.get("/cartelera", async(req,res)=>{
	const sql = require('mssql')
	
	
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CINEMA_CARTELERA.ID, CINEMA_CARTELERA.FECHA,CINEMA_CARTELERA.FECHAINICIO, CINEMA_CARTELERA.FECHAFIN, CINEMA_CARTELERA.ANIO, CINEMA_CARTELERA.MES, CINEMA_CARTELERA.DIA, CINEMA_CARTELERA.HORA, CINEMA_CARTELERA.MINUTO, CINEMA_CARTELERA.HORAFIN, CINEMA_CARTELERA.MINUTOFIN, CINEMA_CARTELERA.TITULO,CINEMA_CARTELERA.CODSALA, CINEMA_SALAS.DESSALA
											FROM CINEMA_CARTELERA LEFT OUTER JOIN CINEMA_SALAS ON CINEMA_CARTELERA.CODSALA = CINEMA_SALAS.CODSALA ORDER BY CINEMA_CARTELERA.FECHA`
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
	let _fecha =  req.body.fecha;
	let _fechaFin =  req.body.fechaFin;
				
	let sqlQry = `UPDATE CINEMA_CARTELERA SET 
	TITULO='${_titulo}',HORA='${_hora}',MINUTO='${_minuto}',
	HORAFIN='${_horaf}',MINUTOFIN='${_minutof}',CODSALA=${_codsala},
	FECHA='${_fecha}',FECHAINICIO='${_fecha}',FECHAFIN='${_fechaFin}'
	WHERE ID=${_id}`
		
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

// OBTIENE LOS CODDOC DE LAS FACTURAS
router.get("/tipodocumentos", async(req,res)=>{
	const sql = require('mssql')
		
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CODDOC, DESDOC, CORRELATIVO FROM TIPODOCUMENTOS WHERE TIPODOC='FAC'`

				console.dir('Enviando listado de asientos');
				res.send(result);
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

// ACTUALIZA EL CORRELATIVO DE TICKETS
router.post("/correlativo", async(req,res)=>{
	const sql = require('mssql')

	try {sql.close()} catch (error) {}

	let _correlativo = Number(req.body.anio);
			
	let sqlQry = `UPDATE CINEMA_CORRELATIVO SET CORRELATIVO=${_correlativo}`
						
		const pool1 = await new sql.ConnectionPool(config, err => {
			// Query
			new sql.Request(pool1)			
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Correlativo de ticket actualizado ...')
				}
			});
			//sql.close()
			//pool1.release();
		})
		pool1.on('error', err => {
			// ... error handler
			console.log('Error al actualizar correlativo : ' + err)
		})
});

// OBTIENE EL CORRELATIVO ACTUAL DEL TICKET
router.get("/correlativo", async(req,res)=>{
	const sql = require('mssql')
	
	try {sql.close()} catch (error) {};

	const pool = await sql.connect(config)		
		try {
			const result = await sql.query `SELECT CORRELATIVO FROM CINEMA_CORRELATIVO`
				res.send(result);
				console.log('correlativo: ' + result)
			} catch (err) {
				console.log(String(err));
			}
			sql.close()
});

module.exports = router;