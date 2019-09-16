const express = require('express');
const router = express.Router();
const execute = require('./connection')


// OBTIENE LA LISTA DE ASIENTOS DE UNA SALA
router.get("/asientos", async(req,res)=>{
	const sql = require('mssql')
	
	let codsala = Number(req.query.codsala);
	let pelicula = req.query.pelicula;
	let horainicio = req.query.horainicio;
	let minutoinicio = req.query.minutoinicio;
	let fecha = req.query.fecha;

	let qry = `SELECT FECHA, PELICULA, NOSALA, NOASIENTO, NOFILA, HORAINICIO, MINUTOINICIO, HORAFIN, MINUTOFIN,CODDOC,CORRELATIVO
											FROM CINEMA_ORDERS 
											WHERE (PELICULA='${pelicula}') AND (NOSALA = ${codsala}) 
											AND (HORAINICIO ='${horainicio}') 
											AND (MINUTOINICIO ='${minutoinicio}') 
											AND (FECHA = '${fecha}')`
	execute.Query(res,qry);

});

// OBTIENE EL LISTADO DE LAS SALAS
router.get("/salas", async(req,res)=>{
	let qry = `SELECT CODSALA, DESSALA, IMG FROM CINEMA_SALAS`
	execute.Query(res,qry);

});

// OCUPA UN ASIENTO
router.post("/ocupar", async(req,res)=>{
	
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
		
	execute.QueryNoSend(res,sqlQry);

});

// DESOCUPA UN ASIENTO
router.post("/desocupar", async(req,res)=>{

	let nosala = Number(req.body.nosala);
	let codasiento = Number(req.body.codasiento);
	let codfila = Number(req.body.codfila);
	
	let pelicula = req.body.pelicula;
	let fecha = req.body.fecha;
	let horainicio = req.body.horainicio;
	let minutoinicio = req.body.minutoinicio;
			
	let sqlQry = `DELETE FROM CINEMA_ORDERS WHERE NOSALA=${nosala} AND FECHA='${fecha}' AND PELICULA='${pelicula}' AND NOASIENTO=${codasiento} AND NOFILA=${codfila} AND HORAINICIO='${horainicio}' AND MINUTOINICIO='${minutoinicio}'`
	execute.Query(res,sqlQry);

});

// LOGIN
router.get("/usuarios", async(req,res)=>{
	let pass = req.query.pass;
	let sql = `SELECT NOMBRE,NIVEL FROM USUARIOS WHERE CLAVE=${pass}`
	execute.Query(res,sql);
});

// INSERTA UN REGISTRO EN LA TABLA CARTELERA
router.post("/nuevapelicula", async(req,res)=>{

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
	execute.Query(res,sqlQry);
	
});

// OBTIENE TODAS LAS PELÍCULAS EN CARTELERA
router.get("/cartelerafecha", async(req,res)=>{

	let _dia = req.query.dia;
	let _mes = req.query.mes;
	let _anio = req.query.anio;
	let _fecha =   _anio + '/' + _mes + '/' + _dia
	
	console.log('solicitando cartelera fecha ' + _fecha)
	
	let qry =  `SELECT CINEMA_CARTELERA.ID, CINEMA_CARTELERA.FECHA, CINEMA_CARTELERA.FECHAINICIO, CINEMA_CARTELERA.FECHAFIN, CINEMA_CARTELERA.ANIO, CINEMA_CARTELERA.MES, CINEMA_CARTELERA.DIA, CINEMA_CARTELERA.HORA, CINEMA_CARTELERA.MINUTO, CINEMA_CARTELERA.HORAFIN, CINEMA_CARTELERA.MINUTOFIN, CINEMA_CARTELERA.TITULO,CINEMA_CARTELERA.CODSALA, CINEMA_SALAS.DESSALA
	FROM CINEMA_CARTELERA LEFT OUTER JOIN CINEMA_SALAS ON CINEMA_CARTELERA.CODSALA = CINEMA_SALAS.CODSALA
	WHERE (CINEMA_CARTELERA.FECHA <= '${_fecha}') ORDER BY CINEMA_CARTELERA.HORA`
	
	execute.Query(res,qry);

});

// OBTIENE TODAS LAS PELÍCULAS EN CARTELERA
router.get("/cartelera", async(req,res)=>{
	let qry = `SELECT CINEMA_CARTELERA.ID, CINEMA_CARTELERA.FECHA,CINEMA_CARTELERA.FECHAINICIO, CINEMA_CARTELERA.FECHAFIN, CINEMA_CARTELERA.ANIO, CINEMA_CARTELERA.MES, CINEMA_CARTELERA.DIA, CINEMA_CARTELERA.HORA, CINEMA_CARTELERA.MINUTO, CINEMA_CARTELERA.HORAFIN, CINEMA_CARTELERA.MINUTOFIN, CINEMA_CARTELERA.TITULO,CINEMA_CARTELERA.CODSALA, CINEMA_SALAS.DESSALA
											FROM CINEMA_CARTELERA LEFT OUTER JOIN CINEMA_SALAS ON CINEMA_CARTELERA.CODSALA = CINEMA_SALAS.CODSALA ORDER BY CINEMA_CARTELERA.FECHA`
	execute.Query(res,qry);
});

// EDITA UNA PELICULA
router.put("/editarpelicula", async(req,res)=>{
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
		
	execute.Query(res,sqlQry);
});

// ELIMINA UNA PELICULA
router.put("/pelicula", async(req,res)=>{

	let _id = Number(req.body.id);
				
	let sqlQry = `DELETE FROM CINEMA_CARTELERA WHERE ID=${_id}`
		
	execute.Query(res,sqlQry);
});

// OBTIENE LOS CODDOC DE LAS FACTURAS
router.get("/tipodocumentos", async(req,res)=>{
	 let sql = `SELECT CODDOC, DESDOC, CORRELATIVO FROM TIPODOCUMENTOS WHERE TIPODOC='FAC'`
	execute.Query(res,sql);
});

// ACTUALIZA EL CORRELATIVO DE TICKETS
router.post("/correlativo", async(req,res)=>{
	
	let _correlativo = Number(req.body.anio);
			
	let sqlQry = `UPDATE CINEMA_CORRELATIVO SET CORRELATIVO=${_correlativo}`
	execute.Query(res,sqlQry);
});

// OBTIENE EL CORRELATIVO ACTUAL DEL TICKET
router.get("/correlativo", async(req,res)=>{
	let sql =  `SELECT CORRELATIVO FROM CINEMA_CORRELATIVO`
	execute.Query(res,sql);
});

module.exports = router;