//variables globales

let dia = JSON.parse(localStorage.getItem('dia'));
let apiKey = 'Gd3Gm7Tav9AVZs3sVDgEcCk9GtRk6ZDn';
let apiQuery = '?api_key=';

window.onload = cargar;

function cargar() {
    cargarEventos(); //Carga de cualquier evento programado para funcionar de principio
    botonesVerMas();//Carga 4 Gifs de tags sugeridos
    cargarTendencias(); //Gifs de tendencias.
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

    let textoActivo = document.getElementById('search_bar');
    textoActivo.addEventListener('input', activarBoton);
    textoActivo.addEventListener('input', mostrarSugerencias);
}

const frases = [
    'monkey',
    'esther piscore',
    'Primero fue la luz',
    'y despues  la factura',
    'de cada 10 personas que ven television',
    '5 son la mitad',
    'Como conformar a un disconforme',
    'Pero el te mató',
    'dabia da',
    'Paraaaa!!',
    'mas'
];

function botonesVerMas(){
    let verMas1 = document.getElementById('ver1');
    let verMas2 = document.getElementById('ver2');
    let verMas3 = document.getElementById('ver3');
    let verMas4 = document.getElementById('ver4');

    verMas1.addEventListener('click',function () {
        verMasSugerencas('Alf');        
    });

    verMas2.addEventListener('click',function () {
        verMasSugerencas('Monty Python');        
    });

    verMas3.addEventListener('click',function () {
        verMasSugerencas('dr Zaius');        
    });

    verMas4.addEventListener('click',function () {
        verMasSugerencas('Power Rangers');        
    });

}

function mostrarSugerencias(event) {
    let desplegableSugerencias = document.getElementById('desplegableSugerencias');
    let divs = [];
    for (let index = 0; index < 3; index++) {
        let random = Math.floor(Math.random() * 11);
        let frase = document.createElement('p');
        frase.classList.add('frase');
        frase.innerHTML = frases[random];
        let fraseEnmarcada = document.createElement('div');
        fraseEnmarcada.setAttribute('class', 'elegida');

        fraseEnmarcada.addEventListener('click', function () {
            let input = document.getElementById('search_bar');
            input.value = frases[random];
            desplegableSugerencias.innerHTML = '';
            desplegableSugerencias.style.display = 'none';

            activarBoton();
        });

        fraseEnmarcada.appendChild(frase);
        divs.push(fraseEnmarcada);
    }

    if (event.srcElement.value) {
        desplegableSugerencias.innerHTML = '';
        divs.forEach((div) => {
            desplegableSugerencias.appendChild(div);
        });
        desplegableSugerencias.style.display = 'flex';
    } else {
        desplegableSugerencias.innerHTML = '';
        desplegableSugerencias.style.display = 'none';
    }
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

//------------------Activar Boton Busqueda--------------------------
function activarBoton() {
    let botonBusqueda = document.getElementById('searchbutton');
    botonBusqueda.addEventListener('click', buscarGifs);
    botonBusqueda.classList.add('searchFrame__search__button--activo');
}
//-----------------------Tema Dia y Tema Noche----------------------
function cambiarNoche() {
        let dropdown = document.getElementById('day_night');
        let wrapper = document.getElementById('tema_wrapper');
        let icono = document.getElementById('logo');
        let lupa = document.getElementById('icono_lupa');

        wrapper.classList.add('night');

        icono.src = './assets/gifOF_logo_dark.png';
        lupa.src = './assets/Combined_Shape.svg';

        dropdown.style.display = 'none';

        localStorage.setItem('dia', false);
        dia = false;
}

function cambiarDia() {
        let dropdown = document.getElementById('day_night');
        let wrapper = document.getElementById('tema_wrapper');
        let icono = document.getElementById('logo');

        wrapper.classList.remove('night');

        icono.src = './assets/gifOF_logo.png';

        dropdown.style.display = 'none';

        localStorage.setItem('dia', true);
        dia = true;
}

async function sugerencias() {
    const busqueda = await fetch(
        'https://api.giphy.com/v1/gifs/search' + apiQuery + apiKey + '&q=' + input
    );
    let result = await busqueda.json();
}

//-------------------------VER MAS----------------------------------

async function verMasSugerencas(valor) {
    let input = valor;
    const busqueda = await fetch(
        'https://api.giphy.com/v1/gifs/search' + apiQuery + apiKey + '&q=' + input
    );
    let result = await busqueda.json();

    let contenedor = document.getElementById('gif_tendencias');
    let titleText = document.getElementById('tendencias_title_text');

    contenedor.innerHTML = '';
    titleText.innerHTML = 'Resultados para: ' + input;

    result.data.forEach((gif) => {
        let gifFrame = document.createElement('div');
        let gifContainer = document.createElement('div');
        let titleBar = document.createElement('div');
        let tag = document.createElement('p');
        let imagen = document.createElement('img');

        gifFrame.className = 'sugerenciasGif__frame';
        gifContainer.className = 'sugerenciasGif__frame__container';
        titleBar.className = 'titlebar';
        tag.textContent = '#' + String(gif.title);

        gifFrame.addEventListener('mouseenter', () => {
            titleBar.style.display = 'flex';
        });

        gifFrame.addEventListener('mouseleave', () => {
            titleBar.style.display = 'none';
        });

        contenedor.appendChild(gifFrame);
        gifFrame.appendChild(gifContainer);
        gifContainer.appendChild(imagen);
        gifContainer.appendChild(titleBar);
        titleBar.appendChild(tag);

        imagen.src = gif.images.downsized_medium.url;

        if (gif.images.downsized_medium.width >= gif.images.downsized_medium.height * 1.5) {
            gifFrame.style.width = '576px';
            imagen.style.width = '100%';
            imagen.style.height = '';
        } else if (gif.images.downsized_medium.height >= gif.images.downsized_medium.width * 1.2) {
            imagen.style.width = '100%';
            imagen.style.height = '';
        }
    });
}



//-------------------------BUSQUEDA----------------------------------
async function buscarGifs() {
    let input = document.getElementById('search_bar').value;
    const busqueda = await fetch(
        'https://api.giphy.com/v1/gifs/search' + apiQuery + apiKey + '&q=' + input
    );
    let result = await busqueda.json();

    let contenedor = document.getElementById('gif_tendencias');
    let titleText = document.getElementById('tendencias_title_text');

    contenedor.innerHTML = '';
    titleText.innerHTML = 'Resultados para: ' + input;

    result.data.forEach((gif) => {
        let gifFrame = document.createElement('div');
        let gifContainer = document.createElement('div');
        let titleBar = document.createElement('div');
        let tag = document.createElement('p');
        let imagen = document.createElement('img');

        gifFrame.className = 'sugerenciasGif__frame';
        gifContainer.className = 'sugerenciasGif__frame__container';
        titleBar.className = 'titlebar';
        tag.textContent = '#' + String(gif.title);

        gifFrame.addEventListener('mouseenter', () => {
            titleBar.style.display = 'flex';
        });

        gifFrame.addEventListener('mouseleave', () => {
            titleBar.style.display = 'none';
        });

        contenedor.appendChild(gifFrame);
        gifFrame.appendChild(gifContainer);
        gifContainer.appendChild(imagen);
        gifContainer.appendChild(titleBar);
        titleBar.appendChild(tag);

        imagen.src = gif.images.downsized_medium.url;

        if (gif.images.downsized_medium.width >= gif.images.downsized_medium.height * 1.5) {
            gifFrame.style.width = '576px';
            imagen.style.width = '100%';
            imagen.style.height = '';
        } else if (gif.images.downsized_medium.height >= gif.images.downsized_medium.width * 1.2) {
            imagen.style.width = '100%';
            imagen.style.height = '';
        }
    });
}

//-------------------------TENDENCIAS--------------------------------

async function cargarTendencias() {
    let gifs = await fetch('https://api.giphy.com/v1/gifs/trending' + apiQuery + apiKey);
    let result = await gifs.json();

    let contenedor = document.getElementById('gif_tendencias');

    result.data.forEach((gif) => {
        let gifFrame = document.createElement('div');
        let gifContainer = document.createElement('div');
        let titleBar = document.createElement('div');
        let tag = document.createElement('p');
        let imagen = document.createElement('img');

        gifFrame.className = 'tendenciasGif__frame';
        gifContainer.className = 'tendenciasGif__frame__container';
        titleBar.className = 'titlebar';
        tag.textContent = '#' + String(gif.title);

        gifFrame.addEventListener('mouseenter', () => {
            titleBar.style.display = 'flex';
        });

        gifFrame.addEventListener('mouseleave', () => {
            titleBar.style.display = 'none';
        });

        contenedor.appendChild(gifFrame);
        gifFrame.appendChild(gifContainer);
        gifContainer.appendChild(imagen);
        gifContainer.appendChild(titleBar);
        titleBar.appendChild(tag);

        imagen.src = gif.images.downsized_medium.url;

        if (gif.images.downsized_medium.width >= gif.images.downsized_medium.height * 1.5) {
            gifFrame.style.width = '576px';
            imagen.style.width = '100%';
            imagen.style.height = '';
        } else if (gif.images.downsized_medium.height >= gif.images.downsized_medium.width * 1.2) {
            imagen.style.width = '100%';
            imagen.style.height = '';
        }
    });
}
