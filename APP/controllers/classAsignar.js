

async function fcnCargarButacas(idContainer,codsala){

    funciones.loadView('../views/sala1.html', idContainer)
    .then(async()=>{
        
        try {
            const response = await fetch(`/api/asientos?codsala=${codsala}`) //&st=${status}`)
            const json = await response.json();

            json.recordset.map((rows)=>{
                try {
                    if (rows.OCUPADO=='SI'){
                        var id ='btn' + rows.FILA.toString() + 'Asiento' + rows.CODIGO.toString();
                        document.getElementById(id).className = "btn btn-icon btn-md bg-danger text-white"
                        document.getElementById(id).addEventListener('click',()=>{
                            fcnReHabilitarAsiento(rows.CODASIENTO);
                        })
                    }
                    if (rows.OCUPADO=='NO'){
                        var id ='btn' + rows.FILA.toString() + 'Asiento' + rows.CODIGO.toString();
                        let btn = document.getElementById(id);
                        btn.className = "btn btn-icon btn-md bg-warning";
                        btn.addEventListener('click',()=>{
                            fcnCargarDatosModal(rows.CODASIENTO,rows.CODIGO,rows.DESCRIPCION,codsala,rows.DESUBICACION)
                        });    
                    }

                } catch (error) {
                    console.log(error);
                }
                
            }).join('\n');
       
        
        } catch (error) {
            console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
            //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
        }
   
    })      
};

function fcnReHabilitarAsiento(idAsiento){
    funciones.Confirmacion('¿Está seguro que desea Re-Habilitar este Asiento?')
        .then((value)=>{
            if(value==true){
               alert('asiento habilitado') 
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

async function fcnCargarDatosModal(codasiento,codigo,descripcion,sala,ubicacion){
    
    document.getElementById('txtDataCodigo').innerText = codigo;
    document.getElementById('txtDataDescripcion').innerText = descripcion;
    document.getElementById('txtDataSala').innerText = sala;
    document.getElementById('txtDataUbicacion').innerText = ubicacion;
};

//$(document).ready(function(e) {
    //$('img[usemap]').rwdImageMaps();
//});