let btnToggler = document.getElementById('btnToggler');
let btnInicio = document.getElementById('btnInicio');
let btnAsignar = document.getElementById('btnAsignar');
let btnConfig = document.getElementById('btnConfig');
let btnSalir = document.getElementById('btnSalir');


function Iniciarlizar(){
    //btnInicio.click();
}
// botón inicio o cartelera
btnInicio.addEventListener('click',(e)=>{
    e.preventDefault();
    funciones.loadView('../views/viewInicio.html','root')
        .then(()=>{
            //btnToggler.click();
        })
});

// botón asignar
btnAsignar.addEventListener('click',(e)=>{
    e.preventDefault();

    funciones.loadView('../views/viewAsignar.html','root')
        .then(()=>{
            funciones.loadScript('../controllers/classAsignar.js','root')
            .then(async ()=>{
              
                await fcnCargarCmbSalas('cmbSalas','mapimage');
                await fcnCargarButacas('mapcontainer',1);  
                    
            })
        })
    
        //btnToggler.click();
});

// boton Config
btnConfig.addEventListener('click', (e)=>{
    e.preventDefault();
    
    funciones.loadView('../views/viewConfig.html','root')
        .then(()=>{
            //btnToggler.click();
        })
});
// boton salir
btnSalir.addEventListener('click',()=>{
    Iniciarlizar();
})


Iniciarlizar();


// SOCKET
socket.on('orden nueva', async function(msg){
    try {
        await fcnCargarButacas('tblAsientos',document.getElementById('cmbSalas').value);
    } catch (error) {
      console.log('No se logró cargar el listado luego del socket')
    }
});