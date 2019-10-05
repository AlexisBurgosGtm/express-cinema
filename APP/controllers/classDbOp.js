classDbOp={
    insertAsiento: async (codsala,codfila,codasiento,horainicio,minutoinicio)=>{
        var data = {
            nosala:Number(codsala),
            codasiento:Number(codasiento),
            codfila:Number(codfila),
            horainicio:horainicio.toString(),
            minutoinicio:minutoinicio.toString()
        }
        
        DbConnection = new JsStore.Instance(DbName);

        await DbConnection.insert({
            Into: "tblTemp",
            Values: [data]
        }, function (rowsAdded) {
            console.log(`Filas agregadas ${rowsAdded}`)
        }, function (err) {
            console.log('No se agregó la fila' & err)
        })
    },
    deleteAsiento: async (codfila,codasiento)=>{
        DbConnection = new JsStore.Instance(DbName);
        DbConnection.select({
            From: 'tblTemp'
        }, function (productos) {
                productos.forEach(function (prod) {
                if(codfila==prod.codfila){
                    if(codasiento==prod.codasiento){
                        let ID = Number(prod.ID);
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
            str = str + `<div class="bg-white col-12">
                    <div class="form-group align-items-center">
                        <img src="../img/logo.png" width="1200" height="400"></img>
                            <br>
                        <h1 class="fontbig7">${GlobalSelectedPelicula}</h1>
                        <br><br>
                        <h2 class="fontbig7">Sala No. ${sala}</h2>
                        <br><br>                        
                        <label class="fontbig7">Fila: <b>${fila}</b></label><label class="fontbig7"> Asiento: <b>${asiento}</b></label>
                        <br><br>
                        <label class="fontbig7">Hora:</label> <label class="fontbig7">${strhorario}</label>
                        <br><br>
                        <label class="fontbig7">Fecha:</label> <label class="fontbig7">${GlobalSelectedFecha}</label>
                        <br><br><br>
                        <div class="bg-white">
                            <h4 class="fontbig4">Disfrute la función !!!</h4>
                            <br>
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

          setTimeout(() => {
            window.print();    
          }, 3000);

          
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