const textarea = document.getElementById('participantes');
const contador = document.getElementById('contador');
const maxParticipantes = 100;
const maxCaracteres = 50;

// F1: Limitar participantes y caracteres
textarea.addEventListener('input', () => {
    let participantes = textarea.value.split('\n');
    let recortado = false;

    // Limitar cada participante a 50 caracteres
    participantes = participantes.map(p => {
        if (p.length > maxCaracteres) {
            recortado = true;
            return p.slice(0, maxCaracteres);
        }
        return p;
    });

    // Limitar a 100 participantes
    if (participantes.length > maxParticipantes) {
        participantes = participantes.slice(0, maxParticipantes);
        recortado = true;
    }

    if (recortado) {
        textarea.value = participantes.join('\n');
    }

    // Contar solo los que no están vacíos
    const participantesValidos = participantes.filter(x => x.trim() !== '');
    contador.textContent = `${participantesValidos.length} / ${maxParticipantes} participantes`;
});

// F2: Manejo de checkboxes y campos de cantidad
const chkEquipos = document.getElementById('chkEquipos');
const chkPorEquipo = document.getElementById('chkPorEquipo');
const cantidadEquipos = document.getElementById('cantidadEquipos');
const cantidadPorEquipo = document.getElementById('cantidadPorEquipo');

chkEquipos.addEventListener('change', () => {
    if (chkEquipos.checked) {
        chkPorEquipo.checked = false;
        cantidadEquipos.disabled = false;
        cantidadPorEquipo.disabled = true;
        cantidadPorEquipo.value = '';
    } else if (!chkPorEquipo.checked) {
        chkEquipos.checked = true;
    }
});
chkPorEquipo.addEventListener('change', () => {
    if (chkPorEquipo.checked) {
        chkEquipos.checked = false;
        cantidadPorEquipo.disabled = false;
        cantidadEquipos.disabled = true;
        cantidadEquipos.value = '';
    } else if (!chkEquipos.checked) {
        chkPorEquipo.checked = true;
    }
});

// F3: Generar equipos
const btnGenerar = document.getElementById('generar');
const resultados = document.getElementById('resultados');
const titulo = document.getElementById('tituloEquipos').value || 'Equipo';

btnGenerar.addEventListener('click', () => {
    // Obtener y limpiar participantes
    let participantes = textarea.value.split('\n').map(x => x.trim()).filter(x => x);
    if (participantes.length < 2) {
        alert('Ingrese al menos 2 participantes.');
        return;
    }

    let modo, cantidad;
    if (chkEquipos.checked) {
        modo = 'equipos';
        cantidad = parseInt(cantidadEquipos.value, 10);
    } else {
        modo = 'porEquipo';
        cantidad = parseInt(cantidadPorEquipo.value, 10);
    }
    const titulo = document.getElementById('tituloEquipos').value || 'Equipo';

    if (!cantidad || cantidad < 1) {
        alert('Ingrese una cantidad válida.');
        return;
    }

    // Mezclar aleatoriamente
    participantes = participantes.sort(() => Math.random() - 0.5);

    let equipos = [];
    if (modo === 'equipos') {
        for (let i = 0; i < cantidad; i++) equipos.push([]);
        participantes.forEach((p, idx) => equipos[idx % cantidad].push(p));
    } else {
        let totalEquipos = Math.ceil(participantes.length / cantidad);
        for (let i = 0; i < totalEquipos; i++) equipos.push([]);
        participantes.forEach((p, idx) => equipos[Math.floor(idx / cantidad)].push(p));
    }

    // Mostrar resultados
    resultados.innerHTML = '';
    equipos.forEach((equipo, i) => {
        const div = document.createElement('div');
        div.className = 'equipo';
        div.innerHTML = `<h3>${titulo} ${i + 1}</h3><ul>${equipo.map(p => `<li>${p}</li>`).join('')}</ul>`;
        resultados.appendChild(div);
    });

    // Mostrar botones de acciones (F4)
    document.getElementById('acciones').style.display = 'flex';
});

// F4: Descargar JPG (usa html2canvas desde CDN)
document.getElementById('descargarJPG').onclick = function() {
    html2canvas(document.getElementById('resultados')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'equipos.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
    });
};

// F4: Copiar al portapapeles (texto plano)
document.getElementById('copiarPortapapeles').onclick = function() {
    const equipos = Array.from(document.querySelectorAll('.equipo')).map(div => {
        const titulo = div.querySelector('h3').textContent;
        const miembros = Array.from(div.querySelectorAll('li')).map(li => li.textContent).join('\n');
        return `${titulo}\n${miembros}`;
    }).join('\n\n');
    navigator.clipboard.writeText(equipos);
    alert('¡Copiado al portapapeles!');
};

// F4: Copiar equipos en columnas (tabulado)
document.getElementById('copiarColumnas').onclick = function() {
    const equipos = Array.from(document.querySelectorAll('.equipo')).map(div =>
        Array.from(div.querySelectorAll('li')).map(li => li.textContent)
    );
    // Transponer para columnas
    let filas = [];
    let maxLen = Math.max(...equipos.map(e => e.length));
    for (let i = 0; i < maxLen; i++) {
        filas.push(equipos.map(e => e[i] || '').join('\t'));
    }
    navigator.clipboard.writeText(filas.join('\n'));
    alert('¡Equipos copiados en columnas!');
};