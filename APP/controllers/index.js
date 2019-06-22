let idEditPelicula=0;

let btnToggler = document.getElementById('btnToggler');
//let btnInicio = document.getElementById('btnInicio');
let btnCartelera = document.getElementById('btnCartelera');
let btnAsignar = document.getElementById('btnAsignar');
let btnConfig = document.getElementById('btnConfig');
let btnSalir = document.getElementById('btnSalir');
let btnLoginIniciar = document.getElementById('btnLoginIniciar');
let btnConfigCartelera = document.getElementById('btnConfigCartelera');


function Iniciarlizar(){
    
    btnCartelera.click();
    $('.search-panel').fadeIn(100);        
}

// botón inicio o cartelera
btnCartelera.addEventListener('click',(e)=>{
    e.preventDefault();
    funciones.loadView('../views/viewCartelera.html','root')
        .then(()=>{
            funciones.loadScript('../controllers/classCartelera.js','root')
            .then(async ()=>{
            
                await fcnCargarCartelera();  
                    
            })
            
        })
});
// botón config cartelera - oculto
btnConfigCartelera.addEventListener('click',(e)=>{
    e.preventDefault();
    funciones.loadView('../views/viewConfigCartelera.html','root')
        .then(()=>{
            funciones.loadScript('../controllers/classCartelera.js','root')
            .then(async ()=>{
            
                await fcnCargarCmbSalas('cmbSalas');
                await fcnCargarPeliculas('tblPeliculas');  
                    
            })
        })
});

// botón asignar
btnAsignar.addEventListener('click',(e)=>{
    e.preventDefault();

    funciones.loadView('../views/viewAsignar.html','root')
        .then(()=>{
            funciones.loadScript('../controllers/classAsignar.js','root')
            .then(async ()=>{
                
                //fcnAsignarBotones();
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
btnSalir.addEventListener('click',(e)=>{
    e.preventDefault();
    $('.search-panel').fadeIn(100);
})

// boton login iniciar
btnLoginIniciar.addEventListener('click',()=>{
    fcnLogin(document.getElementById('txtLoginUser').value,document.getElementById('txtLoginPass').value);
})


async function fcnLogin(user,pass){

    let nivel = 0;
    try {
        const response = await fetch(`/api/usuarios?user=${user}&pass=${pass}`) //&st=${status}`)
        const json = await response.json();
        
        json.recordset.map((rows)=>{
            nivel=  Number(rows.NIVEL);
       }).join('\n');

       
    } catch (error) {
        return 0;
    }

    if (nivel==0){
        funciones.AvisoError('Su usuario o contraseña son incorrectos');
    }else{
        $('.search-panel').fadeOut(100);
        document.getElementById('txtLoginUser').value = '';
        document.getElementById('txtLoginPass').value = '';
    }
}

// SOCKET
socket.on('orden nueva', async function(msg){
    try {
        await fcnCargarButacas('tblAsientos',document.getElementById('cmbSalas').value);
    } catch (error) {
      console.log('No se logró cargar el listado luego del socket')
    }
});


Iniciarlizar();