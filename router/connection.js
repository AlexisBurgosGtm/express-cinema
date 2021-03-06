﻿
const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
//const config = {user: 'iEx', password: 'iEx', server: 'SERVERALEXIS\\SQLEXPRESS', database: 'DB_A45479_EXPRESS', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};
const sql = require('mssql');

let execute = {
	Query : (res,sqlqry)=>{
		
		console.log('ejecutando consulta... ');
		
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			//pool1.request() or: new sql.Request(pool1)
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				//if(err) throw err;
				if(err){
					console.log(err.message);
					res.send(err.message);
				}else{
					//console.log(result);
					res.send(result);
				}
					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},

	QueryNoSend : (res,sqlqry)=>{
		//const sql = require('mssql')
		console.log('ejecutando consulta... ');
		
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			//pool1.request() or: new sql.Request(pool1)
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				//if(err) throw err;
				if(err){
					console.log(err.message);
					res.send(err.message)
				}else{
					//res.send(result);
					//res.status(200);
					res.send('ejecución realizada exitosamente...')
				}
					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},

}

module.exports =  execute;


