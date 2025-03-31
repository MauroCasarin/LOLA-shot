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
        if (verificarColisionHelicoptero(objetivo)) {
            clearInterval(intervalo);
            gameOver();
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

function verificarColision(objetivo) {
    const helicopteroRect = helicoptero.getBoundingClientRect();
    const objetivoRect = objetivo.getBoundingClientRect();
    return !(helicopteroRect.right < objetivoRect.left ||
        helicopteroRect.left > objetivoRect.right ||
        helicopteroRect.bottom < objetivoRect.top ||
        helicopteroRect.top > objetivoRect.bottom);
}

function verificarColisionHelicoptero(objetivo) {
    const helicopteroRect = helicoptero.getBoundingClientRect();
    const objetivoRect = objetivo.getBoundingClientRect();
    return !(helicopteroRect.right < objetivoRect.left ||
        helicopteroRect.left > objetivoRect.right ||
        helicopteroRect.bottom < objetivoRect.top ||
        helicopteroRect.top > objetivoRect.bottom);
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
        // Llamar a verificarColisionHelicoptero aquí
        if (verificarColisionHelicoptero(objetivo)) {
            clearInterval(intervalo);
            gameOver();
        }
    }, 20);
}

function verificarColisionHelicoptero(objetivo) {
    const helicopteroRect = helicoptero.getBoundingClientRect();
    const objetivoRect = objetivo.getBoundingClientRect();
    const colision = !(helicopteroRect.right < objetivoRect.left ||
        helicopteroRect.left > objetivoRect.right ||
        helicopteroRect.bottom < objetivoRect.top ||
        helicopteroRect.top > objetivoRect.bottom);
    if (colision) {
        return true;
    }
    return false;
}

function gameOver() {
    juegoActivo = false;
    sonidos.gameOver.play();
    juego.style.display = 'none';
    finJuego.style.display = 'block';
    puntuacionFinal.textContent = 'Puntuación final: ' + puntuacion;
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
});

function moverHelicopteroArriba() {
    if (!juegoActivo) return;
    helicopteroY -= 20;
    if (helicopteroY < 0) helicopteroY = 0;
    helicoptero.style.top = helicopteroY + 'px';
}

function moverHelicopteroAbajo() {
    if (!juegoActivo) return;
    helicopteroY += 20;
    if (helicopteroY > window.innerHeight - 50) helicopteroY = window.innerHeight - 50;
    helicoptero.style.top = helicopteroY + 'px';
}

function dispararHelicoptero() {
    if (!juegoActivo) return;
    sonidos.disparo.play();
    helicoptero.style.transform = 'translateY(-50%) rotate(-15deg)';
    setTimeout(() => {
        helicoptero.style.transform = 'translateY(-50%) rotate(0deg)';
    }, 200);
    crearLaser();
}

arribaBtn.addEventListener('touchstart', (event) => {
    event.preventDefault();
    moverHelicopteroArriba();
});

arribaBtn.addEventListener('click', moverHelicopteroArriba);

abajoBtn.addEventListener('touchstart', (event) => {
    event.preventDefault();
    moverHelicopteroAbajo();
});

abajoBtn.addEventListener('click', moverHelicopteroAbajo);

dispararBtn.addEventListener('touchstart', (event) => {
    event.preventDefault();
    dispararHelicoptero();
});

dispararBtn.addEventListener('click', dispararHelicoptero);

document.addEventListener('keydown', (event) => {
    if (!juegoActivo) return;
    switch (event.key) {
        case 'ArrowUp':
            helicopteroY -= 20;
            if (helicopteroY < 0) helicopteroY = 0;
            helicoptero.style.top = helicopteroY + 'px';
            break;
        case 'ArrowDown':
            helicopteroY += 20;
            if (helicopteroY > window.innerHeight - 50) helicopteroY = window.innerHeight - 50;
            helicoptero.style.top = helicopteroY + 'px';
            break;
        case ' ': // Barra espaciadora
            sonidos.disparo.play();
            helicoptero.style.transform = 'translateY(-50%) rotate(-15deg)';
            setTimeout(() => {
                helicoptero.style.transform = 'translateY(-50%) rotate(0deg)';
            }, 200);
            crearLaser();
            break;
    }
});

juego.addEventListener('touchstart', (event) => {
    if (!juegoActivo) return;
    event.preventDefault(); // Evita el desplazamiento de la pantalla
    const touch = event.touches[0];
    const helicopteroRect = helicoptero.getBoundingClientRect();
    const touchY = touch.clientY;

    // Calcula la diferencia entre la posición táctil y el centro del helicóptero
    const diffY = touchY - (helicopteroRect.top + helicopteroRect.height / 2);

    // Mueve el helicóptero en la dirección del toque
    helicopteroY += diffY * 0.1; // Ajusta la velocidad de movimiento

    // Limita la posición del helicóptero dentro de los límites de la pantalla
    if (helicopteroY < 0) helicopteroY = 0;
    if (helicopteroY > window.innerHeight - 50) helicopteroY = window.innerHeight - 50;
    helicoptero.style.top = helicopteroY + 'px';
});

setInterval(crearObjetivo, 2000);
setInterval(crearNube, 3000);