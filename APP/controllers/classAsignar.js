

async function fcnCargarButacas(idContainer,codsala){
    
    setTimeout(() => {
        $('img[usemap]').rwdImageMaps();
    }, 2);    


    //document.getElementById('mapaSala').rwdImageMaps();
    //$('img[usemap]').rwdImageMaps();
    console.log('aplicado')
    /*
    try {
        const response = await fetch(`/api/asientos?codsala=${codsala}`) //&st=${status}`)
        const json = await response.json();
         
        let tblBody = json.recordset.map((rows)=>{
            return `<div class="card col-lg-4 col-sm-2 col-md-4 bg-light" 
                        data-toggle="modal" data-target="#ModOrdenF" 
                        onClick="fcnCargarDatosModal('${rows.CODASIENTO}','${rows.CODIGO}','${rows.DESCRIPCION}','${rows.DESSALA}','${rows.DESUBICACION}');">
                        <h4 class="text-right text-top card-img-overlay">${rows.CODIGO}</h4>
                        <img class="card-img-center" src="../assets/img/butaca.png" alt="image" style="width:80%">
                    </div>`;        
       }).join('\n');

       document.getElementById(idContainer).innerHTML = tblBody;

    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE ORDENES ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
    */
};

async function fcnCargarCmbSalas(idContainer){

    try {
        const response = await fetch(`/api/salas`) //&st=${status}`)
        const json = await response.json();
         
        let str = json.recordset.map((rows)=>{
            return `<option value="${rows.CODSALA}">${rows.DESSALA}</option>`;
       }).join('\n');

       document.getElementById(idContainer).innerHTML = str;

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