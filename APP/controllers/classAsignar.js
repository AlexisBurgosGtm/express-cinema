
async function fcnCargarButacas(idContainer,codsala){
    
    let strViewSala = '';

    if (Number(codsala)==1){
        strViewSala ='../views/sala1.html'
    };

    if (Number(codsala)==2){
        strViewSala ='../views/sala2.html'
    };

    
    funciones.loadView(strViewSala, idContainer)
    .then(async()=>{

        await fcnCargarGrid(Number(codsala));
   
    })      
};

async function fcnCargarGrid(codsala){

        let contadorOcupadas =0; 
        let contadorDisponibles = 0;
        let Ocupadas = document.getElementById('txtOcupadas');
        let Disponibles = document.getElementById('txtDisponibles');

        try {
            const response = await fetch(`/api/asientos?codsala=${codsala}`) //&st=${status}`)
            const json = await response.json();

            json.recordset.map((rows)=>{
                try {
                    if (rows.OCUPADO=='SI'){
                        contadorOcupadas += 1;
                        
                        var id ='btn' + rows.FILA.toString() + 'Asiento' + rows.CODIGO.toString();
                        let btn = document.getElementById(id);
                        btn.className = "btn btn-icon btn-md bg-danger text-white"

                        //btn.removeEventListener('click',fcnReHabilitarAsiento())

                        //btn.addEventListener('click',()=>{
                         //   fcnReHabilitarAsiento(rows.CODASIENTO);
                        //})
                    }
                    if (rows.OCUPADO=='NO'){
                        contadorDisponibles += 1;
                        
                        var id ='btn' + rows.FILA.toString() + 'Asiento' + rows.CODIGO.toString();
                        let btn = document.getElementById(id);
                        btn.className = "btn btn-icon btn-md bg-warning";
                        
                        //btn.removeEventListener('click',fcnCargarDatosModal())

                        //btn.addEventListener('click',()=>{
                          //  fcnCargarDatosModal(rows.CODASIENTO,rows.CODIGO, 'Asiento No. ' + rows.CODIGO + ' en Fila ' + rows.FILA, codsala,rows.DESUBICACION)
                        //});    
                    }

                } catch (error) {
                    console.log(error);
                }
                
            }).join('\n');
            
            Disponibles.innerHTML = contadorDisponibles;
            Ocupadas.innerHTML = contadorOcupadas;
        
        } catch (error) {
            console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
            //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
        }
       
};

async function fcnReHabilitarAsiento(idAsiento){
    funciones.Confirmacion('¿Está seguro que desea Re-Habilitar este Asiento?')
        .then(async (value)=>{
            if(value==true){
                var data =JSON.stringify({
                    codasiento:idAsiento
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
                                await fcnCargarGrid(Number(cmbSalas.value));
                            }
                        })
                    .catch(
                        ()=>{
                            funciones.AvisoError('No se pudo DesOcupar este asiento');
                        }
                    )      
            }
        })
};

async function fcnCargarCmbSalas(idContainer,idmage){

    try {
        const response = await fetch(`/api/salas`) //&st=${status}`)
        const json = await response.json();
        
        let str = json.recordset.map((rows)=>{
            return `<option value="${rows.CODSALA}">${rows.DESSALA}</option>`;
            
       }).join('\n');

       document.getElementById(idContainer).innerHTML = str;
       //document.getElementById(idmage).attributes.src = '../salas/' + imgroute;

    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE SALAS ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
};

async function fcnCargarDatosModal(fila,asiento,sala){
    //$('#ModOrdenF').modal('show');
    document.getElementById('txtDataCodigo').innerText = codigo;
    document.getElementById('txtDataDescripcion').innerText = descripcion;
    document.getElementById('txtDataSala').innerText = sala;
    //document.getElementById('txtDataUbicacion').innerText = ubicacion;

    btnAsignarAsiento.addEventListener('click', ()=>{
        fcnAsignarAsiento(codasiento);
        
    })
};

async function fcnAsignarAsiento(idAsiento){
    var data =JSON.stringify({
        codasiento:idAsiento
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
                    await fcnCargarGrid(Number(cmbSalas.value));
                    document.getElementById('btnCancelarAsignar').click();;
                }
            })
        .catch(
            ()=>{
                //console.log('Error al tratar de actualizar el correlativo')
                funciones.AvisoError('No se pudo Ocupar este asiento');
            }
        )              
};

async function fcnReHabilitarTodos(){

    funciones.Confirmacion('¿Está seguro que desea Re-Habilitar TODOS LOS ASIENTOS DE ESTA SALA?')
        .then(async (value)=>{
            if(value==true){

                var data =JSON.stringify({
                    codsala: Number(cmbSalas.value)
                });
                                          
                var peticion = new Request('/api/desocupartodos', {
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
                                funciones.Aviso('Todos los asientos han sido desocupados');
                                await fcnCargarGrid(Number(cmbSalas.value));
                            }
                        })
                    .catch(
                        ()=>{
                            funciones.AvisoError('No se pudo DesOcupar todos los asientos');
                        }
                    )      
            }
        })
};

let btnAsignarAsiento;
let cmbSalas;
let btnLiberarAsientos;

function fcnAsignarBotones(){
    try {
        btnAsignarAsiento = document.getElementById('btnAsignarAsiento');
        cmbSalas = document.getElementById('cmbSalas');
        btnLiberarAsientos = document.getElementById('btnLiberarAsientos');
    } catch (error) {
        
    }

    cmbSalas.addEventListener('change',async ()=>{
        await fcnCargarButacas('mapcontainer',Number(cmbSalas.value));  
    });

    btnLiberarAsientos.addEventListener('click',()=>{
        fcnReHabilitarTodos();
    })

}


