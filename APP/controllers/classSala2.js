async function fcnCargarGrid(codsala,fecha,pelicula,horainicio,minutoinicio){

    GlobalSelectedFecha= fecha;
    GlobalSelectedPelicula=pelicula;
    GlobalSelectedHoraInicio=horainicio;
    GlobalSelectedMinutoInicio=minutoinicio;

    let contadorOcupadas =0; 
    let contadorDisponibles = 139;
    let Ocupadas = document.getElementById('txtOcupadas');
    let Disponibles = document.getElementById('txtDisponibles');

    try {
        const response = await fetch(`/api/asientos?codsala=${codsala}&fecha=${fecha}&pelicula=${pelicula}&horainicio=${horainicio}&minutoinicio=${minutoinicio}`) 
        const json = await response.json();

        json.recordset.map((rows)=>{
            //'btn1Asiento1'
            contadorOcupadas += 1;
            var id = 'btn' + rows.NOFILA + 'Asiento' + rows.NOASIENTO;
            let btn = document.getElementById(id);
            btn.className = "btn btn-icon btn-md bg-danger text-white text-central"
            
            // listeners para que aparezca el número de factura cuando el mouse pase encima
            btn.addEventListener('mouseover',()=>{
                document.getElementById('containerdata').innerHTML = `<h1>${rows.CODDOC} - ${rows.CORRELATIVO}</h1>`
            })
            btn.addEventListener('mouseout',()=>{
                document.getElementById('containerdata').innerHTML = '';
            })
            
        }).join('\n');
        
        Disponibles.innerHTML = contadorDisponibles - contadorOcupadas;
        Ocupadas.innerHTML = contadorOcupadas;
    
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
    }
    
    classDbOp.deleteTodos();
};

async function fcnCargarTipoDoc(){
    
    let coddoc = document.getElementById('cmbTipoDoc');

    try {
        const response = await fetch(`/api/tipodocumentos`) 
        const json = await response.json();
         let dt  = ''
        json.recordset.map((rows)=>{
            dt += `<option value=${rows.CODDOC}>${rows.CODDOC}</option>`
        }).join('\n');
        
        coddoc.innerHTML = dt;
            
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE DOCUMENTOS' + error);
    }
   
};

async function fcnCargarDatosModal(idfila,idasiento,sala){
    //$('#ModOrdenF').modal('show');
    document.getElementById('txtDataFila').innerText = idfila;
    document.getElementById('txtDataAsiento').innerText = idasiento;
    document.getElementById('txtDataSala').innerText = sala;
    //document.getElementById('txtDataUbicacion').innerText = ubicacion;

    btnAsignarAsiento.addEventListener('click', ()=>{
        //fcnAsignarAsiento(codasiento);
        
    })
};

function fcnOcuparAsiento(idfila,idasiento){

    GlobalSelectedFila = idfila;
    GlobalSelectedAsiento = idasiento;
    let Ocupadas = Number(document.getElementById('txtOcupadas').innerHTML);
    let Disponibles = Number(document.getElementById('txtDisponibles').innerHTML);
    let lbOcupadas =document.getElementById('txtOcupadas');
    let lbDisponibles = document.getElementById('txtDisponibles');
         
    console.log(Ocupadas);
    console.log(Disponibles);
    //normal
    //btn.className = "btn btn-icon btn-md bg-warning text-central"
    //ocupado
    //btn.className = "btn btn-icon btn-md bg-danger text-white text-central"
    
    let btn =document.getElementById('btn' + idfila + 'Asiento' + idasiento)
    //si esta disponible
    if(btn.className=='btn btn-icon btn-md bg-warning text-central'){
        btn.className = 'btn btn-icon btn-md bg-info text-white';

        Ocupadas = (Ocupadas + 1);
        Disponibles = (Disponibles - 1);

        
        lbDisponibles.innerHTML = Disponibles.toString();
        lbOcupadas.innerHTML = Ocupadas.toString();  

        classDbOp.insertAsiento(1,GlobalSelectedFila,GlobalSelectedAsiento,GlobalSelectedHoraInicio,GlobalSelectedMinutoInicio)      

    }else{
         //si esta ocupado (rojo)
         if(btn.className == 'btn btn-icon btn-md bg-danger text-white text-central'){

            funciones.Confirmacion('¿Está seguro que desea liberar este asiento?')
            .then(async(value)=>{
                if(value==true){
                    //desocupa el asiento ya ocupado en rojo
                    var data =JSON.stringify({
                        codasiento:idasiento,
                        codfila:idfila,
                        pelicula:GlobalSelectedPelicula,
                        fecha:GlobalSelectedFecha,
                        horainicio:GlobalSelectedHoraInicio,
                        minutoinicio:GlobalSelectedMinutoInicio,
                        nosala:2
                    });
                              
                    var peticion = new Request('/api/desocupar', {
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
                                    funciones.Aviso('El asiento ha sido desocupado con éxito');
                                    document.getElementById('btn' + idfila + 'Asiento' + idasiento).className='btn btn-icon btn-md bg-warning text-central';
                                    //await fcnCargarGrid(1,GlobalSelectedFecha,GlobalSelectedPelicula,GlobalSelectedHoraInicio,GlobalSelectedMinutoInicio);    
                                    Ocupadas = (Ocupadas - 1);
                                    Disponibles = (Disponibles + 1);
                            
                                    lbDisponibles.innerHTML = Disponibles.toString();
                                    lbOcupadas.innerHTML = Ocupadas.toString();  
                                }
                            })
                        .catch(
                            ()=>{
                                funciones.AvisoError('No se pudo DesOcupar este asiento');
                            }
                        )      

                }
            })

        }else{
            //si se está ocupando (azul)
            btn.className = 'btn btn-icon btn-md bg-warning text-central';

            Ocupadas = Ocupadas-1;
            Disponibles = Disponibles+1;
    
            lbDisponibles.innerHTML = Disponibles.toString();
            lbOcupadas.innerHTML = Ocupadas.toString();        
    
            classDbOp.deleteAsiento(GlobalSelectedFila,GlobalSelectedAsiento);               

        }
    }
}

function fcnTerminarTicket(){
    $('#ModOrdenF').modal('show')
     //document.getElementById('txtDataNumero').focus();
     document.getElementById('cmbTipoDoc').focus();
}
