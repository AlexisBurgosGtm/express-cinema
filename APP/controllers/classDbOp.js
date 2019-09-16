classDbOp={
    insertAsiento: async (codsala,codfila,codasiento,horainicio,minutoinicio)=>{
        var data = {
            nosala:codsala,
            codasiento:codasiento,
            codfila:codfila,
            horainicio:horainicio,
            minutoinicio:minutoinicio
        }
        
        DbConnection = new JsStore.Instance(DbName);

        await DbConnection.insert({
            Into: "tblTemp",
            Values: [data]
        }, function (rowsAdded) {
            console.log('')
        }, function (err) {
            console.log(err);
        })
    },
    deleteAsiento: async (codfila,codasiento)=>{
        DbConnection = new JsStore.Instance(DbName);
        console.log(codfila);
        console.log(codasiento);

        DbConnection.select({
            From: 'tblTemp'
        }, function (productos) {
    
            productos.forEach(function (prod) {
                if(codfila==prod.codfila){
                    if(codasiento==prod.codasiento){
                        console.log(prod);
                        let ID = Number(prod.ID)
                        // elimina el asiento
                        DbConnection.delete({
                            From: 'tblTemp',
                            Where: {
                                ID: ID
                            }
                        }, function (rowsDeleted) {
                            if (rowsDeleted > 0) {
                              console.log('asiento removido...')  
                            }
                        }, function (error) {
                            //alert(error.Message);
                            console.log('no se pudo remover nada..')
                        })

                    }
                }
    
            })
           
        }), function (error) {
            console.log(error);
        };

    },
    sendAsientos: async (codsala)=>{
        let _coddoc = document.getElementById('cmbTipoDoc').value;
        let _correlativo =document.getElementById('txtDataNumero').value;

        document.getElementById('btnCancelarAsignar').click();

        DbConnection = new JsStore.Instance(DbName);
        
        DbConnection.select({
            From: 'tblTemp'
        }, function (asientos) {
            asientos.forEach(async function (row) {
                
                classDbOp.enviar(row.codasiento,row.codfila,GlobalSelectedPelicula,GlobalSelectedFecha,GlobalSelectedHoraInicio,GlobalSelectedMinutoInicio,Number(codsala),_coddoc,_correlativo,GlobalEmpnit)
       
            }, function (error) {
                console.log(error);
                }
           )
          fcnImprimirTicket(codsala);
        });
    },
    escribirAsientos: async (idContainer)=>{
        let container = document.getElementById(idContainer);
        let str = '';
        
        DbConnection = new JsStore.Instance(DbName);
        
        DbConnection.select({
            From: 'tblTemp'
        }, function (asientos) {
            asientos.forEach(async function (rows){
                str = str + `<label>Fila:<b>${rows.codfila}</b></label>  <label>Asiento:<b>${rows.codasiento}</b></label><br>`;
                //console.log(str);
            }, function (error) {
                console.log(error);
                }
           )
           
          container.innerHTML = str;

        });
    },
    deleteTodos: async ()=>{
        DbConnection = new JsStore.Instance(DbName);

        DbConnection.delete({
            From: 'tblTemp',
        }, function (rowsDeleted) {
            if (rowsDeleted > 0) {
              console.log('Todos los asientos han sido removidos...')  
            }
        }, function (error) {
            //alert(error.Message);
        })
    },
    enviar: async (asiento,fila,pelicula,fecha,hora,minuto,sala,coddoc,correlativo,empnit)=>{
        var data =JSON.stringify({
            codasiento:asiento,
            codfila:fila,
            pelicula:pelicula,
            fecha:fecha,
            horainicio:hora,
            minutoinicio:minuto,
            nosala:sala,
            coddoc:coddoc,
            correlativo:correlativo,
            empnit:empnit
        });
                  
        var peticion = new Request('/api/ocupar', {
            method: 'POST',
            headers: new Headers({
              // Encabezados
                'Content-Type': 'application/json'
            }),
            body: data
        });
        await fetch(peticion)
            .then(async function(res) {
                console.log('Estado: ', res.status);
                if (res.status==200)
                    {   
                       console.log('asiento enviado ' + asiento + ' fila ' + fila) 
                    }
                })
            .catch(
                ()=>{
                    //console.log('Error al tratar de actualizar el correlativo')
                }
            )        
    }
};