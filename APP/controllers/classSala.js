async function fcnCargarGrid(codsala,fecha){

    let contadorOcupadas =0; 
    let contadorDisponibles = 0;
    let Ocupadas = document.getElementById('txtOcupadas');
    let Disponibles = document.getElementById('txtDisponibles');

    try {
        const response = await fetch(`/api/asientos?codsala=${codsala}&fecha=${fecha}`) //&st=${status}`)
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