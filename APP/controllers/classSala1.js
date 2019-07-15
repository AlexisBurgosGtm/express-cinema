async function fcnCargarGrid(codsala,fecha,pelicula,horainicio,minutoinicio){

    GlobalSelectedFecha= fecha;
    GlobalSelectedPelicula=pelicula;
    GlobalSelectedHoraInicio=horainicio;
    GlobalSelectedMinutoInicio=minutoinicio;

    let contadorOcupadas =0; 
    let contadorDisponibles = 135; //144
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
            btn.className = "btn btn-icon btn-md bg-danger text-white"
            
        }).join('\n');
        
        Disponibles.innerHTML = contadorDisponibles - contadorOcupadas;
        Ocupadas.innerHTML = contadorOcupadas;
    
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
    }
   
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

    //btn btn-icon btn-md bg-warning
    //btn btn-icon btn-md bg-danger text-white
    //document.getElementById('btn' + idfila + 'Asiento' + idasiento).className;
    
    if(document.getElementById('btn' + idfila + 'Asiento' + idasiento).className=='btn btn-icon btn-md bg-danger text-white'){
           funciones.Confirmacion('¿Está seguro que desea Re-Habilitar este Asiento?')
            .then(async (value)=>{
            if(value==true){
                var data =JSON.stringify({
                    codasiento:idasiento,
                    codfila:idfila,
                    pelicula:GlobalSelectedPelicula,
                    fecha:GlobalSelectedFecha,
                    horainicio:GlobalSelectedHoraInicio,
                    minutoinicio:GlobalSelectedMinutoInicio,
                    nosala:1
                });
                          
                var peticion = new Request('/api/desocupar', {
                    method: 'PUT',
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
                                await fcnCargarGrid(1,GlobalSelectedFecha,GlobalSelectedPelicula,GlobalSelectedHoraInicio,GlobalSelectedMinutoInicio);
                                funciones.Aviso('El asiento ha sido desocupado con éxito');
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
        fcnCargarDatosModal(idfila,idasiento,1);
        $('#ModOrdenF').modal('show');
    }

}

