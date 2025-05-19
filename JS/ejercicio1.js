// Colores para los sectores de la ruleta
const coloresRuleta = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'];

// Variables de estado
let elementosRuleta = [];
let elementosOcultos = [];
let ultimoElementoSorteado = null;
let girandoRuleta = false;
let modoEdicion = true;
let modoPantallaCompleta = false;

// Elementos del DOM
const areaTexto = document.getElementById('areaTexto');
const canvasRuleta = document.getElementById('ruleta');
const contextoRuleta = canvasRuleta.getContext('2d');
const btnIniciar = document.getElementById('btnIniciar');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnPantallaCompleta = document.getElementById('btnPantallaCompleta');
const resultadoSorteo = document.getElementById('resultadoSorteo');
const contenedorPrincipal = document.getElementById('contenedorPrincipal');

// Valores iniciales de muestra
const elementosInicialesMuestra = "Alumno 1\nAlumno 2\nAlumno 3\nAlumno 4\nAlumno 5";
areaTexto.value = elementosInicialesMuestra;

// Función para actualizar la lista de elementos desde el textarea
function actualizarElementosDesdeTexto() {
    const texto = areaTexto.value.trim();
    // Filtrar elementos que no están ocultos
    const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
    elementosRuleta = lineas.filter(elem => !elementosOcultos.includes(elem));
    dibujarRuleta();
}

// Función para dibujar la ruleta
function dibujarRuleta() {
    // Limpiar el canvas
    contextoRuleta.clearRect(0, 0, canvasRuleta.width, canvasRuleta.height);
    
    // Si no hay elementos visibles, mostrar mensaje
    if (elementosRuleta.length === 0) {
        contextoRuleta.fillStyle = '#f0f0f0';
        contextoRuleta.beginPath();
        contextoRuleta.arc(canvasRuleta.width / 2, canvasRuleta.height / 2, canvasRuleta.width / 2 - 5, 0, Math.PI * 2);
        contextoRuleta.fill();
        
        contextoRuleta.fillStyle = '#666';
        contextoRuleta.font = '16px Arial';
        contextoRuleta.textAlign = 'center';
        contextoRuleta.fillText('No hay elementos', canvasRuleta.width / 2, canvasRuleta.height / 2);
        return;
    }
    
    // Dibujar los sectores de la ruleta
    const anguloSector = (Math.PI * 2) / elementosRuleta.length;
    const radioRuleta = canvasRuleta.width / 2 - 5;
    const centroX = canvasRuleta.width / 2;
    const centroY = canvasRuleta.height / 2;
    
    for (let i = 0; i < elementosRuleta.length; i++) {
        // Calcular el ángulo inicial y final del sector
        const anguloInicio = i * anguloSector;
        const anguloFin = (i + 1) * anguloSector;
        
        // Dibujar el sector
        contextoRuleta.beginPath();
        contextoRuleta.moveTo(centroX, centroY);
        contextoRuleta.arc(centroX, centroY, radioRuleta, anguloInicio, anguloFin);
        contextoRuleta.closePath();
        
        // Establecer el color del sector
        contextoRuleta.fillStyle = coloresRuleta[i % coloresRuleta.length];
        contextoRuleta.fill();
        
        // Dibujar la línea divisoria del sector
        contextoRuleta.strokeStyle = '#fff';
        contextoRuleta.lineWidth = 2;
        contextoRuleta.stroke();
        
        // Dibujar el texto del elemento
        contextoRuleta.save();
        contextoRuleta.translate(centroX, centroY);
        contextoRuleta.rotate(anguloInicio + (anguloSector / 2));
        contextoRuleta.textAlign = 'right';
        contextoRuleta.fillStyle = '#333';
        
        // Ajustar el tamaño del texto según el número de elementos
        let tamañoFuente = 14;
        if (elementosRuleta.length > 10) {
            tamañoFuente = 10;
        } else if (elementosRuleta.length > 20) {
            tamañoFuente = 8;
        }
        
        contextoRuleta.font = `${tamañoFuente}px Arial`;
        contextoRuleta.fillText(elementosRuleta[i], radioRuleta - 10, 5);
        contextoRuleta.restore();
    }
    
    // Dibujar el círculo central
    contextoRuleta.beginPath();
    contextoRuleta.arc(centroX, centroY, 20, 0, Math.PI * 2);
    contextoRuleta.fillStyle = '#fff';
    contextoRuleta.fill();
    contextoRuleta.strokeStyle = '#ddd';
    contextoRuleta.lineWidth = 2;
    contextoRuleta.stroke();
}

// Función para girar la ruleta
function girarRuleta() {
    if (girandoRuleta || elementosRuleta.length === 0) return;
    
    girandoRuleta = true;
    resultadoSorteo.textContent = "Girando...";
    
    // Generar un ángulo aleatorio entre 5 y 10 vueltas
    const anguloAleatorio = Math.floor(Math.random() * 5 + 5) * 360;
    const anguloFinal = anguloAleatorio + Math.floor(Math.random() * 360);
    
    // Aplicar animación de giro
    canvasRuleta.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
    canvasRuleta.style.transform = `rotate(${anguloFinal}deg)`;
    
    // Calcular el elemento seleccionado después de la animación
    setTimeout(function() {
        const anguloNormalizado = anguloFinal % 360;
        const anguloSector = 360 / elementosRuleta.length;
        const sectorSeleccionado = Math.floor(anguloNormalizado / anguloSector);
        const elementoSeleccionado = elementosRuleta[(elementosRuleta.length - sectorSeleccionado - 1) % elementosRuleta.length];
        
        ultimoElementoSorteado = elementoSeleccionado;
        resultadoSorteo.textContent = `Elemento seleccionado: ${elementoSeleccionado}`;
        girandoRuleta = false;
    }, 3000);
}

// Función para resaltar y ocultar el último elemento sorteado
function resaltarYOcultarElemento() {
    if (ultimoElementoSorteado === null) return;
    
    // Buscar y resaltar el elemento en el textarea
    const lineas = areaTexto.value.split('\n');
    for (let i = 0; i < lineas.length; i++) {
        if (lineas[i].trim() === ultimoElementoSorteado) {
            // Marcar el elemento como oculto
            if (!elementosOcultos.includes(ultimoElementoSorteado)) {
                elementosOcultos.push(ultimoElementoSorteado);
            }
            
            // Actualizar el textarea
            areaTexto.value = lineas.map(linea => 
                linea.trim() === ultimoElementoSorteado ? 
                `${linea} [Sorteado]` : linea
            ).join('\n');
            
            // Actualizar elementos y ruleta
            actualizarElementosDesdeTexto();
            break;
        }
    }
}

// Función para reiniciar el sorteo
function reiniciarSorteo() {
    elementosOcultos = [];
    ultimoElementoSorteado = null;
    
    // Restablecer el textarea eliminando las marcas [Sorteado]
    const lineas = areaTexto.value.split('\n');
    areaTexto.value = lineas.map(linea => linea.replace(' [Sorteado]', '')).join('\n');
    
    // Reiniciar la ruleta
    canvasRuleta.style.transition = 'none';
    canvasRuleta.style.transform = 'rotate(0deg)';
    
    // Actualizar la ruleta
    actualizarElementosDesdeTexto();
    resultadoSorteo.textContent = "Sorteo reiniciado";
}

// Función para alternar el modo pantalla completa
function alternarPantallaCompleta() {
    modoPantallaCompleta = !modoPantallaCompleta;
    
    if (modoPantallaCompleta) {
        contenedorPrincipal.classList.add('modo-pantalla-completa');
        btnPantallaCompleta.textContent = 'Salir de Pantalla Completa';
    } else {
        contenedorPrincipal.classList.remove('modo-pantalla-completa');
        btnPantallaCompleta.textContent = 'Pantalla Completa';
    }
}

// Eventos
// Inicializar la ruleta al cargar la página
window.addEventListener('load', actualizarElementosDesdeTexto);

// Evento para el área de texto
areaTexto.addEventListener('input', actualizarElementosDesdeTexto);

// Evento para el botón de iniciar sorteo
btnIniciar.addEventListener('click', girarRuleta);

// Evento para el botón de reiniciar
btnReiniciar.addEventListener('click', reiniciarSorteo);

// Evento para el botón de pantalla completa
btnPantallaCompleta.addEventListener('click', alternarPantallaCompleta);

// Evento para clic en la ruleta
canvasRuleta.addEventListener('click', girarRuleta);

// Eventos de teclado
document.addEventListener('keydown', function(evento) {
    switch (evento.key) {
        case ' ': // Tecla de espacio
            if (!evento.target.classList.contains('texto-elementos')) {
                girarRuleta();
            }
            break;
        case 's': // Tecla S
        case 'S':
            resaltarYOcultarElemento();
            break;
        case 'e': // Tecla E
        case 'E':
            areaTexto.focus();
            modoEdicion = true;
            break;
        case 'r': // Tecla R
        case 'R':
            reiniciarSorteo();
            break;
        case 'f': // Tecla F
        case 'F':
            alternarPantallaCompleta();
            evento.preventDefault();
            break;
    }
});