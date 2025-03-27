const inicio = document.getElementById('inicio');
const juego = document.getElementById('juego');
const finJuego = document.getElementById('fin-juego');
const jugarBtn = document.getElementById('jugar');
const reiniciarBtn = document.getElementById('reiniciar');
const helicoptero = document.getElementById('helicoptero');
const puntuacionElem = document.getElementById('puntuacion');
const puntuacionFinal = document.getElementById('puntuacion-final');
const arribaBtn = document.getElementById('arriba');
const abajoBtn = document.getElementById('abajo');
const dispararBtn = document.getElementById('disparar');

let puntuacion = 0;
let helicopteroY = 0;
let velocidadObjetivos = 2;
let objetivosEliminados = 0;
let juegoActivo = false;
let lasers = [];

const objetivosSrc = [
    "https://raw.githubusercontent.com/MauroCasarin/Lola-Game/e17ef4a544f71b08c4cf0418af133e7834ac7157/brahma.png",
    "https://raw.githubusercontent.com/MauroCasarin/Lola-Game/refs/heads/main/quilmes.png",
    "https://raw.githubusercontent.com/MauroCasarin/Lola-Game/refs/heads/main/stela.png"
];

const nubesSrc = [
    "https://raw.githubusercontent.com/MauroCasarin/Lola-Game/refs/heads/main/cloud.png",
    "https://raw.githubusercontent.com/MauroCasarin/Lola-Game/refs/heads/main/cloud2.png"
];

const sonidos = {
    disparo: new Audio("http://www.marcelomagni.com.ar/sound/disparo.mp3"),
    explosion: new Audio("http://www.marcelomagni.com.ar/sound/explo.mp3"),
    caida: new Audio("http://www.marcelomagni.com.ar/sound/caenobj.mp3"),
    gameOver: new Audio("http://www.marcelomagni.com.ar/sound/game-over.mp3")
};

function crearObjetivo() {
    if (!juegoActivo) return;
    const objetivo = document.createElement('img');
    objetivo.src = objetivosSrc[Math.floor(Math.random() * objetivosSrc.length)];
    objetivo.classList.add('target');
    objetivo.style.top = Math.random() * (window.innerHeight - 50) + 'px';
    objetivo.style.left = window.innerWidth + 'px';
    juego.appendChild(objetivo);
    moverObjetivo(objetivo);
}

function moverObjetivo(objetivo) {
    if (!juegoActivo) return;
    let objetivoX = window.innerWidth;
    const intervalo = setInterval(() => {
        objetivoX -= velocidadObjetivos;
        objetivo.style.left = objetivoX + 'px';
        if (objetivoX < -50) {
            clearInterval(intervalo);
            objetivo.remove();
        }
        if (verificarColision(objetivo)) {
            clearInterval(intervalo);
            objetivo.remove();
            sonidos.explosion.play();
            puntuacion++;
            objetivosEliminados++;
            puntuacionElem.textContent = 'Puntuación: ' + puntuacion;
            if (objetivosEliminados % 10 === 0) {
                velocidadObjetivos += 1;
            }
        }
    }, 20);
}

function crearNube() {
    if (!juegoActivo) return;
    if (document.querySelectorAll('.cloud').length < 3) {
        const nube = document.createElement('img');
        nube.src = nubesSrc[Math.floor(Math.random() * nubesSrc.length)];
        nube.classList.add('cloud');
        nube.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        nube.style.left = window.innerWidth + 'px';
        juego.appendChild(nube);
        moverNube(nube);
    }
}

function moverNube(nube) {
    let nubeX = parseInt(nube.style.left);
    const intervalo = setInterval(() => {
        nubeX -= 1;
        nube.style.left = nubeX + 'px';
        if (nubeX < -50) {
            clearInterval(intervalo);
            nube.remove();
        }
    }, 50);
}

function verificarColision(elemento) {
    const helicopteroRect = helicoptero.getBoundingClientRect();
    const elementoRect = elemento.getBoundingClientRect();
    return !(helicopteroRect.right < elementoRect.left ||
        helicopteroRect.left > elementoRect.right ||
        helicopteroRect.bottom < elementoRect.top ||
        helicopteroRect.top > elementoRect.bottom);
}

function gameOver() {
    juegoActivo = false;
    sonidos.gameOver.play();
    juego.style.display = 'none';
    finJuego.style.display = 'block';
    puntuacionFinal.textContent = 'Puntuación final: ' + puntuacion;
}

function crearLaser() {
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.style.top = helicopteroY + 23 + 'px';
    laser.style.left = 60 + 'px';
    juego.appendChild(laser);
    lasers.push(laser);
    moverLaser(laser);
}

function moverLaser(laser) {
    let laserX = 60;
    const intervalo = setInterval(() => {
        laserX += 10;
        laser.style.left = laserX + 'px';
        if (laserX > window.innerWidth) {
            clearInterval(intervalo);
            laser.remove();
            lasers.shift();
        }
        verificarColisionLaser(laser);
    }, 20);
}

function verificarColisionLaser(laser) {
    const laserRect = laser.getBoundingClientRect();
    document.querySelectorAll('.target').forEach(objetivo => {
        const objetivoRect = objetivo.getBoundingClientRect();
        if (!(laserRect.right < objetivoRect.left ||
            laserRect.left > objetivoRect.right ||
            laserRect.bottom < objetivoRect.top ||
            laserRect.top > objetivoRect.bottom)) {
            objetivo.remove();
            laser.remove();
            lasers.shift();
            sonidos.explosion.play();
            puntuacion++;
            objetivosEliminados++;
            puntuacionElem.textContent = 'Puntuación: ' + puntuacion;
            if (objetivosEliminados % 10 === 0) {
                velocidadObjetivos += 1;
            }
        }
    });
}

jugarBtn.addEventListener('click', () => {
    inicio.style.display = 'none';
    juego.style.display = 'block';
    puntuacion = 0;
    objetivosEliminados = 0;
    velocidadObjetivos = 2;
    puntuacionElem.textContent = 'Puntuación: 0';
    helicopteroY = window.innerHeight / 2 - 25;
    helicoptero.style.top = helicopteroY + 'px';
    document.querySelectorAll('.target').forEach(objetivo => objetivo.remove());
    juegoActivo = true;
    setInterval(crearObjetivo, 2000);
    setInterval(crearNube, 3000);
});

reiniciarBtn.addEventListener('click', () => {
    finJuego.style.display = 'none';
    juego.style.display = 'block';
    puntuacion = 0;
    objetivosEliminados = 0;
    velocidadObjetivos = 2;
    puntuacionElem.textContent = 'Puntuación: 0';
    document.querySelectorAll('.target').forEach(objetivo => objetivo.remove());
    juegoActivo = true;
    helicopteroY = window.innerHeight / 2 - 25;
    helicoptero.style.top = helicopteroY + 'px';
    setInterval(crearObjetivo, 2000);
    setInterval(crearNube, 3000);
}); // Cierre de la función reiniciarBtn

arribaBtn.addEventListener