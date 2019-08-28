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
    $('.search-panel').fadeIn(90); 

    let txtLogin = document.getElementById('txtLoginPass')

    txtLogin.addEventListener('keydown',(e)=>{
        
        if (e.code=='Enter')  {
            btnLoginIniciar.click();
        };
        
        if (e.code=='NumpadEnter')  {
            btnLoginIniciar.click();
        };
    })       

    txtLogin.focus();
}

// botón inicio o cartelera
btnCartelera.addEventListener('click',(e)=>{
    e.preventDefault();
    funciones.loadView('../views/viewCartelera.html','root')
        .then(()=>{
            funciones.loadScript('../controllers/classCartelera.js','root')
            .then(async ()=>{
            
                
                let f = new Date();
                let y = f.getFullYear();
                let m = f.getMonth()+1;
                if (m<10){m = '0' + m};
                let d = f.getDate();
                if (d<10){d = '0' + d};
                
                document.getElementById('txtFecha').value = y + '-' + m + '-' + d;
                await fcnCargarCartelera(); 
                
                document.getElementById('btnCargarCartelera').addEventListener('click',async()=>{await fcnCargarCartelera();}) 
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
                document.getElementById('txtFechaPelicula').value = new Date().getDate()

                
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

// boton salir
btnSalir.addEventListener('click',(e)=>{
    e.preventDefault();
    $('.search-panel').fadeIn(100);
})

// boton login iniciar
btnLoginIniciar.addEventListener('click',()=>{
    //fcnLogin(document.getElementById('txtLoginUser').value,document.getElementById('txtLoginPass').value);
    fcnLogin(document.getElementById('txtLoginPass').value);
})


async function fcnLogin(pass){

    let nivel = 0;
    try {
        //const response = await fetch(`/api/usuarios?user=${user}&pass=${pass}`) //&st=${status}`)
        const response = await fetch(`/api/usuarios?pass=${pass}`) //&st=${status}`)
        const json = await response.json();
        
        json.recordset.map((rows)=>{
            nivel=  Number(rows.NIVEL);
       }).join('\n');

       
    } catch (error) {
        return 0;
    }

    if (nivel==0){
        funciones.AvisoError('Su contraseña es incorrecta');
    }else{
        $('.search-panel').fadeOut(100);
        //document.getElementById('txtLoginUser').value = '';
        document.getElementById('txtLoginPass').value = '';
    }
}

// SOCKET
socket.on('orden nueva', async function(msg){
    try {
       
    } catch (error) {
      console.log('No se logró cargar el listado luego del socket')
    }
});


Iniciarlizar();

function fcnImprimirTicket(pelicula,nofila,noasiento,sala){
    funciones.loadView('../views/ticket.html','root')
        .then(()=>{
            //window.print(); 
            document.getElementById('lbPelicula').innerText = GlobalSelectedPelicula;
            document.getElementById('lbAsiento').innerText = GlobalSelectedAsiento;           
            document.getElementById('lbFila').innerText = GlobalSelectedFila;           
            document.getElementById('lbFecha').innerText = GlobalSelectedFecha;           
            document.getElementById('lbSala').innerText = 'Sala ' + sala;           

            /*
            const RUTA_API = "http://localhost:8000"
            let impresora = new Impresora(RUTA_API);
            impresora.setFontSize(1, 1);
            impresora.setEmphasize(0);
            impresora.setAlign("center");
            impresora.write(GlobalSelectedPelicula & "\n");
            impresora.write("No. Asiento: " & GlobalSelectedAsiento & "\n");
            impresora.write("Telefono: 123456789\n");
            impresora.write("Fecha/Hora: 2019-08-01 13:21:22\n");
            impresora.write("--------------------------------\n");
            impresora.write("Venta de plugin para impresora\n");
            impresora.setAlign("right");
            impresora.write("25 USD\n");
            impresora.write("--------------------------------\n");
            impresora.write("TOTAL: 25 USD\n");
            impresora.write("--------------------------------\n");
            impresora.setAlign("center");
            impresora.write("***Gracias por su compra***");
            impresora.end()
                .then(valor => {
                    loguear("Al imprimir: " + valor);
                })
*/

            document.getElementById('btnAtrasTicket').addEventListener('click',()=>{
                btnCartelera.click();
            })
        })
}