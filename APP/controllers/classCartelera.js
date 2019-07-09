async function fcnCargarCmbSalas(idContainer){

    try {
        const response = await fetch(`/api/salas`) //&st=${status}`)
        const json = await response.json();
        
        let str = json.recordset.map((rows)=>{
            return `<option value="${rows.CODSALA}">${rows.DESSALA}</option>`;
            
       }).join('\n');

       document.getElementById(idContainer).innerHTML = str;
       document.getElementById('cmbSalasE').innerHTML = str;
       //document.getElementById(idmage).attributes.src = '../salas/' + imgroute;

    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE SALAS ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
};

async function fcnCargarPeliculas(idContainer){

    try {
        const response = await fetch(`/api/cartelera`) //&st=${status}`)
        const json = await response.json();
        //<td>${rows.DIA + '/' + rows.MES + '/' + rows.ANIO}</td>
        let str = json.recordset.map((rows)=>{
            return `<tr>
                        <td>${rows.TITULO}</td>
                        <td>${rows.DIA + '/' + rows.MES + '/' + rows.ANIO}</td>
                        <td>Inicia: ${rows.HORA + ':' + rows.MINUTO} - Finaliza: ${rows.HORAFIN + ':' + rows.MINUTOFIN}</td>
                        <td>${rows.DESSALA}</td>
                        <td>
                            <button class="btn btn-icon btn-circle btn-warning btn-md" data-toggle="modal" data-target="#ModEditarPelicula" onclick="fcnCargarDatosEditar(${rows.ID},'${rows.TITULO}','${rows.HORA}','${rows.MINUTO}','${rows.HORAFIN}','${rows.MINUTOFIN}',${rows.CODSALA});">
                                <i class="icon-new-file"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-icon btn-circle btn-danger btn-md" onclick="fcnEliminarPelicula(${rows.ID});">
                                <i class="icon-close"></i>    
                            </button>
                        </td>
                    </tr>`
       }).join('\n');

       document.getElementById(idContainer).innerHTML = str;
       //document.getElementById(idmage).attributes.src = '../salas/' + imgroute;
       console.log('peliculas cargadas')
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE SALAS ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
};

async function fcnEliminarPelicula(codpelicula){
    funciones.Confirmacion('¿Está seguro que desea Eliminar esta Película')
    .then(async (value)=>{
        if(value==true){
            var data =JSON.stringify({
                id:Number(codpelicula)
            });
                      
            var peticion = new Request('/api/pelicula', {
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
                            funciones.Aviso('Película eliminada Exitosamente')
                            await fcnCargarPeliculas('tblPeliculas');
                        }
                    })
                .catch(
                    ()=>{
                        funciones.AvisoError('No se pudo Eliminar la Película');
                    }
                )      
        }
    })
}

async function fcnNuevaPelicula(){
    funciones.Confirmacion('¿Está seguro que desea GUARDAR esta Película')
    .then(async (value)=>{
        if(value==true){
            let fecha = new Date(document.getElementById('txtFechaPelicula').value);

            let _anio = Number(fecha.getFullYear());

            let _mes = fecha.getUTCMonth() + 1;

            let _dia = fecha.getUTCDate()

            console.log(_dia + '/' + _mes + '/' + _anio);

            var data =JSON.stringify({
                anio : _anio,
                mes : _mes,
                dia : _dia,
                hora : document.getElementById('cmbHoraPelicula').value.toString(),
                minuto : document.getElementById('cmbMinutoPelicula').value.toString(),
                horafin : document.getElementById('cmbHoraFPelicula').value.toString(),
                minutofin : document.getElementById('cmbMinutoFPelicula').value.toString(),
                titulo : document.getElementById('txtTituloPelicula').value,
                codsala : Number(document.getElementById('cmbSalas').value),
                fecha: fecha
            });
                      
            var peticion = new Request('/api/nuevapelicula', {
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
                            funciones.Aviso('Película Agregada Exitosamente')
                            await fcnCargarPeliculas('tblPeliculas');
                            fcnLimpiarCampos();
                            document.getElementById('btnCancelarNuevo').click();
                        }
                    })
                .catch(
                    ()=>{
                        funciones.AvisoError('No se pudo Guardar la Película');
                    }
                )      
        }
    })
};

async function fcnEditarPelicula(){
    funciones.Confirmacion('¿Está seguro que desea EDITAR esta Película')
    .then(async (value)=>{
        if(value==true){          

            var data =JSON.stringify({
                id:Number(idEditPelicula),
                hora : document.getElementById('cmbHoraPeliculaE').value.toString(),
                minuto : document.getElementById('cmbMinutoPeliculaE').value.toString(),
                horafin : document.getElementById('cmbHoraFPeliculaE').value.toString(),
                minutofin : document.getElementById('cmbMinutoFPeliculaE').value.toString(),
                titulo : document.getElementById('txtTituloPeliculaE').value,
                codsala : Number(document.getElementById('cmbSalasE').value)
            });
                      
            var peticion = new Request('/api/editarpelicula', {
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
                            funciones.Aviso('Película Editada Exitosamente')

                            await fcnCargarPeliculas('tblPeliculas');
                            fcnLimpiarCampos();
                            document.getElementById('btnCancelarNuevo').click();
                        }
                    })
                .catch(
                    ()=>{
                        funciones.AvisoError('No se pudo editar la Película');
                    }
                )      
        }
    })
};

function fcnLimpiarCampos(){
    //document.getElementById('txtFechaPelicula').value = new Date;
    document.getElementById('txtTituloPelicula').value = "";
}

async function fcnCargarCartelera(){
    let f = new Date(document.getElementById('txtFecha').value)

    try {
       
        let d = f.getUTCDate(); let m = f.getUTCMonth()+1; let y = f.getFullYear();
        

        const response = await fetch(`/api/cartelerafecha?dia=${d}&mes=${m}&anio=${y}`) //&st=${status}`)
        const json = await response.json();
        
        let str1 ='', str2='';

        json.recordset.map((rows)=>{
            if (rows.CODSALA==1){str1 += `<div class="col-sm-12 col-md-6 col-lg-4">
            <div class="card text-center">
                <h5 class="text-white">${rows.TITULO}</h5>
                <span>Horario: ${rows.HORA + ':' + rows.MINUTO} a ${rows.HORAFIN + ':' + rows.MINUTOFIN}</span>
                <button class="form-control btn-info text-white" onclick="CargarSala1(${rows.ID});">Seleccionar</button>
            </div>
        </div>`}
        if (rows.CODSALA==2){str2 += `<div class="col-sm-12 col-md-6 col-lg-4">
            <div class="card text-center">
                <h5 class="text-white">${rows.TITULO}</h5>
                <span>Horario: ${rows.HORA + ':' + rows.MINUTO} a ${rows.HORAFIN + ':' + rows.MINUTOFIN}</span>
                <button class="form-control btn-info text-white" onclick="CargarSala2(${rows.ID});">Seleccionar</button>
            </div>
        </div>`}
       }).join('\n');


       document.getElementById('containerS1').innerHTML = str1;
       document.getElementById('containerS2').innerHTML = str2;
       
       
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA DE CARTELERA ' + error);
        //funciones.AvisoError('No se pudo cargar la lista de Ordenes pendientes');
    }
    

};


function fcnCargarDatosEditar(id,titulo,hora,minuto,horafinal,minutofinal,codsala){
    document.getElementById('txtTituloPeliculaE').value = titulo;
    document.getElementById('cmbHoraPeliculaE').value = hora;
    document.getElementById('cmbMinutoPeliculaE').value = minuto;
    document.getElementById('cmbHoraFPeliculaE').value = horafinal;
    document.getElementById('cmbMinutoFPeliculaE').value = minutofinal;
    document.getElementById('cmbSalasE').value = codsala;
    idEditPelicula = id;
}

function CargarSala1(idAsiento){
    funciones.loadView('../views/viewSala1.html','root')
    .then(()=>{
        //funciones.loadScript('../controllers/classAsignar.js','root')
        
    })
}

function CargarSala2(idAsiento){
    funciones.loadView('../views/viewSala2.html','root')
    .then(()=>{
        //funciones.loadScript('../controllers/classAsignar.js','root')
        
    })
}