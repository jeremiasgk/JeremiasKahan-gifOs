let dia = JSON.parse(localStorage.getItem('dia'));
let apiKey = 'Gd3Gm7Tav9AVZs3sVDgEcCk9GtRk6ZDn';
let apiQuery = '?api_key=';
let recorder;

window.onload = cargar;

function cargar() {
    cargarEventos(); //Carga de cualquier evento programado para funcionar de principio
    mostrarGifsCreados();
}

function cargarEventos() {
    if (dia === null) {
        localStorage.setItem('dia', true);
    }

    if (dia) {
        cambiarDia();
    } else {
        cambiarNoche();
    }

    let dropdownButton = document.getElementById('dropdown_theme');
    dropdownButton.addEventListener('click', dropdownMenu);

    let botonNoche = document.getElementById('night_button');
    botonNoche.addEventListener('click', cambiarNoche);

    let botonDia = document.getElementById('day_button');
    botonDia.addEventListener('click', cambiarDia);

    let comenzar = document.getElementById('comenzar');
    comenzar.addEventListener('click', cargarDisplay);
}

//---------------------Menu Desplegable-----------------------------
function dropdownMenu() {
    let dropdown = document.getElementById('day_night');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'flex';
    }
}

//-----------------------Tema Dia y Tema Noche----------------------
function cambiarNoche() {
    let dropdown = document.getElementById('day_night');
    let wrapper = document.getElementById('tema_wrapper');
    let icono = document.getElementById('logo');

    wrapper.classList.add('night');

    icono.src = '../assets/gifOF_logo_dark.png';

    dropdown.style.display = 'none';

    localStorage.setItem('dia', false);
    dia = false;
}

function cambiarDia() {
    let dropdown = document.getElementById('day_night');
    let wrapper = document.getElementById('tema_wrapper');
    let icono = document.getElementById('logo');

    wrapper.classList.remove('night');

    icono.src = '../assets/gifOF_logo.png';

    dropdown.style.display = 'none';

    localStorage.setItem('dia', true);
    dia = JSON.parse(localStorage.getItem('dia'));
}

function cargarDisplay(){   
    let enableButtons = document.getElementById('windowDisplay__botones');
    let window = document.getElementById('window');
    let windowDisplay = document.getElementById('windowDisplay');
    let titulo = document.getElementById('recordMessage');

    titulo.innerHTML = "Un Chequeo Antes de Empezar";
    enableButtons.style.display = 'flex';
    window.style.display = 'none';
    windowDisplay.style.display = 'block';
    cargarCamara();
}

async function cargarCamara(){
    let grabar = document.getElementById('windowDisplay__botones__grabar');
    let wrapper = document.getElementById('windowDisplay__container--loop');
    let video = document.getElementById('video');
    
    wrapper.style.display = 'none';
    video.srcObject = await pasarVideo(); 
    video.play();

    grabar.addEventListener('click', grabarGif);
}

async function pasarVideo(){
    let stream = null;

    try{
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { 
                height: { max: 480 },
                width: { ideal: 860 }
        }
        });
    }
    catch(err){
        alert('No se pudo activar la camara. Por favor, revisa la consola');
        console.log(err)
    }
    return stream;
}

 async function grabarGif(){
    let titulo = document.getElementById('recordMessage');
    let disableButtons = document.getElementById('windowDisplay__botones');
    let enableButtons = document.getElementById('windowDisplay__botones--grabar');
    let listo = document.getElementById('windowDisplay__botones__parar');
    
    let stream = await pasarVideo();
    
    titulo.innerHTML = "Capturando Tu Guifo";
    disableButtons.style.display = 'none';
    enableButtons.style.display = 'flex';

    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 840,
        height: 440,
        onGifRecordingStarted: function() {
        console.log('started');
        },
        });

    listo.addEventListener('click', detenerGrabacion);
    recorder.startRecording();
    recorder.camera = stream;
}

function detenerGrabacion(){
    
    recorder.stopRecording(call);
    
    async function call(){
        let titulo = document.getElementById('recordMessage');
        let subir = document.getElementById('windowDisplay__botones__subir');
        let disableButtons = document.getElementById('windowDisplay__botones--grabar');
        let enableButtons = document.getElementById('windowDisplay__botones--listo');
        let wrapper = document.getElementById('windowDisplay__container');
        let wrapper2 = document.getElementById('windowDisplay__container--loop');
        let imagen = document.createElement('img');
        recorder.camera.stop();
        
        let form = new FormData();
        
        form.append("file", recorder.getBlob(), "myGif");
        subir.addEventListener('click', subirGif(form));
        
        titulo.innerHTML = "Vista Previa";
        wrapper2.appendChild(imagen);
        imagen.className = 'windowDisplay__container--loop__gifPreview';
        disableButtons.style.display = 'none';
        enableButtons.style.display = 'flex';
        
        wrapper.style.display = 'none';
        wrapper2.style.display = 'block';
        
        imagen.src = URL.createObjectURL(recorder.getBlob());
    }
    /* let repetir = document.getElementById('windowDisplay__botones__repetir'); */
    
    /* repetir.addEventListener('click', repetirCaptura); */
}

function subirGif(archivo){
    console.log(archivo.get('file'));
    
    fetch('https://upload.giphy.com/v1/gifs' + apiQuery + apiKey + '&file=jeremiasgk', {
        method: "POST",
        body: archivo
    })
    .then(response => {
        console.log(response.status);
        return response.json();
    })
    .then(data => {
        var dataid = data.data.id;
        let gif = 'https://media1.giphy.com/media/'+ dataid + '/giphy.gif?cid=52afa79a31b48e99d4268c4cc71df9dcbf8f8b3c9db10a07&rid=giphy.gif';
        let gifsArray = JSON.parse(localStorage.getItem('gifsCreados')) || [];

        gifsArray.unshift(gif);
        
        localStorage.setItem('gifsCreados', JSON.stringify(gifsArray));

        mostrarGifsCreados();

        let wrapper = document.getElementById('windowDisplay');
        let wrapper2 = document.getElementById('windowExito');
        let gifContainer = document.getElementById('windowExito__container__imagen');
        let gifPreview = document.createElement('img');

        wrapper.style.display = 'none';
        wrapper2.style.display = 'block';
        gifContainer.appendChild(gifPreview);
        
        gifPreview.src = 'https://media.giphy.com/media/' + dataid + '/200w_d.gif';
    })   
}

function mostrarGifsCreados() {
    let gifsArray = JSON.parse(localStorage.getItem('gifsCreados')) || [];

    gifsArray.forEach((gif) => {
        let guifosWrapper = document.getElementById('guifosWrapper');
        let imagen = document.createElement('img');

        imagen.src = gif;
        guifosWrapper.appendChild(imagen)
    });
}
