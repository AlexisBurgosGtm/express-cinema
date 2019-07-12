async function fcnCargarGrid(codsala,fecha,pelicula,horainicio,minutoinicio){

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

function fcnOcuparAsiento(){
    $('#ModOrdenF').modal('show');

    alert(this.id);
}

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