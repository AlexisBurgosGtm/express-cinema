async function fcnCargarGrid(codsala,fecha,pelicula,horainicio,minutoinicio){

    GlobalSelectedFecha= fecha;
    GlobalSelectedPelicula=pelicula;
    GlobalSelectedHoraInicio=horainicio;
    GlobalSelectedMinutoInicio=minutoinicio;

    let contadorOcupadas =0; 
    let contadorDisponibles = 144; //135
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
        btn.className = 'btn btn-icon btn-md bg-danger text-white';

        Ocupadas = (Ocupadas + 1);
        Disponibles = (Disponibles - 1);

        
        lbDisponibles.innerHTML = Disponibles.toString();
        lbOcupadas.innerHTML = Ocupadas.toString();        

    }else{
    //si esta ocupado
        btn.className = 'btn btn-icon btn-md bg-warning text-central';
   
        Ocupadas = Ocupadas-1;
        Disponibles = Disponibles+1;

        lbDisponibles.innerHTML = Disponibles.toString();
        lbOcupadas.innerHTML = Ocupadas.toString();        
    }

}

async function fcnAsignarAsiento(){
    let _coddoc = document.getElementById('cmbTipoDoc').value;
    let _correlativo =document.getElementById('txtDataNumero').value;

    var data =JSON.stringify({
        codasiento:GlobalSelectedAsiento,
        codfila:GlobalSelectedFila,
        pelicula:GlobalSelectedPelicula,
        fecha:GlobalSelectedFecha,
        horainicio:GlobalSelectedHoraInicio,
        minutoinicio:GlobalSelectedMinutoInicio,
        nosala:2,
        coddoc:_coddoc,
        correlativo:_correlativo,
        empnit:GlobalEmpnit
    });
              
    var peticion = new Request('/api/ocupar', {
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
                    await funciones.Aviso("Asiento asignado con éxito");
                    //await fcnCargarGrid(Number(cmbSalas.value));
                    await fcnCargarGrid(2,GlobalSelectedFecha,GlobalSelectedPelicula,GlobalSelectedHoraInicio,GlobalSelectedMinutoInicio);

                    document.getElementById('btnCancelarAsignar').click();
                    fcnImprimirTicket(GlobalSelectedPelicula,GlobalSelectedFila,GlobalSelectedAsiento,2);
                }
            })
        .catch(
            ()=>{
                //console.log('Error al tratar de actualizar el correlativo')
                funciones.AvisoError('No se pudo Ocupar este asiento');
            }
        )           


}


function fcnTerminarTicket(){
    $('#ModOrdenF').modal('show')
}
