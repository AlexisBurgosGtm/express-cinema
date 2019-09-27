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
    escribirTicket: async (idContainer,sala)=>{
        let container = document.getElementById(idContainer);
        let str = '';
        
        DbConnection = new JsStore.Instance(DbName);
        
        DbConnection.select({
            From: 'tblTemp'
        }, function (asientos) {
            asientos.forEach(async function (rows){
            let fila;
            switch (rows.codfila) {
                case 1:
                    fila='A';
                break;            
                case 2:
                    fila='B';
                break;            
                case 3:
                    fila='C';
                break;            
                case 4:
                    fila='D';
                break;            
                case 5:
                    fila='E';
                break;            
                case 6:
                    fila='F';
                break;            
                case 7:
                    fila='G';
                break;            
            }
            let asiento;
            switch (rows.codasiento) {
                case 100:
                    asiento="A"    
                break;
                case 200:
                    asiento="B"    
                break;            
                default:
                    asiento = rows.codasiento;
                break;
            }

            let strhorario = `${GlobalSelectedHoraInicio}:${GlobalSelectedMinutoInicio} horas`;
            str = str + `<div class="bg-white">
                    <div class="form-group">
                        <img src="../img/logo.png" width="130" height="65"></img>
                        <br>
                        <h6 id="">${GlobalSelectedPelicula}</h6>
                        <br>
                        <h6 id="">Sala No. ${sala}</h6>
                        <br>
                        <label>Fecha:</label> <label id="">${GlobalSelectedFecha}</label>
                        <br>
                        <label>Hora:</label> <label id="">${strhorario}</label>
                        <br>
                        <label>Fila: <b>${fila}</b></label><label> Asiento: <b>${asiento}</b></label><br>
                        <br>
                        <label>---------------------</label>
                        <br></br>
                        <div class="bg-white">
                            <small>Disfrute la función !!!</small>
                        </div>
                    </div>
                </div>
                <h1 style ="page-break-after: always"> </h1>`;
                
                //console.log(str);
            }, function (error) {
                console.log(error);
                }
           )
           
          container.innerHTML = str;
          //window.print();
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