import getFile from './data.js';

const html = document.getElementsByTagName('html')[0];
const toggleTheme = (theme) => {
    html.dataset.theme = theme;
}

const notCheckedSVG = `
<div class="fs-5 w-50 p-0" id="badge-moi">
    <span class="b-light-blue
     t-dark-blue d-flex align-items-center rounded-4 w-100" style="width: 1.4rem!important;">
     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-play-fill" viewBox="-1 0 16 16">
     <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
   </svg>
    </span>
</div>`;

const checkedSVG = `
<div class="fs-5 w-50 p-0" id="badge-moi">
    <span class="b-light-green t-dark-green d-flex align-items-center rounded-4 w-100" style="width: 1.4rem!important;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
    </span>
</div>`;

const pendingSVG = `
<div class="fs-5 w-50 p-0" id="badge-moi">
    <span class="b-light-yellow t-dark-yellow d-flex align-items-center rounded-4 w-100" style="width: 1.4rem!important;">
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
  </svg>
    </span>
</div>`;

const listaEjercicios = document.getElementById('exercise-list');
const addPresetContainer = document.getElementById('add-preset-training');
const shareBtn = document.getElementById('share-btn');

getContext();
async function getContext() {
    localStorage.removeItem('exercise-to-view');
    localStorage.removeItem('data-to-copy');
    const listaEjercicios = localStorage.getItem('listaEjercicios');
    if (!listaEjercicios) {
        const res = await getFile('exercises.json');
        if (res.ok) {
            localStorage.setItem('listaEjercicios', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: res.data }));
        } else {
            alert(`Error: ${res.error}`);
        }
    }
}

document.getElementById('order').onclick = () => {
    const ejercicios = getExercises();
    if (ejercicios) {
        localStorage.setItem('ejercicios', JSON.stringify(ejercicios.sort(compare)));
        loadExercises();
    }
}

document.getElementById('delete').onclick = () => {
    localStorage.removeItem('ejercicios');
    loadExercises();
}

localStorage.setItem('current-edit', null);

loadExercises();

function loadExercises() {
    listaEjercicios.innerHTML = '';
    listaEjercicios.style.height = '0%';
    const ejercicios = getExercises();
    if (ejercicios) {
        ejercicios.forEach((ejercicio, i) => {
            const tempo = ejercicio.isometrico ? ejercicio.tempo : ejercicio.tempo.join('');
            createNewExercise(ejercicio.orden, ejercicio.nombre, ejercicio.series, ejercicio.id, ejercicio.completado, ejercicios.length, i, tempo);
        });
        const done = ejercicios.map(x => x.completado).filter(x => x !== true).length > 0 ? false : true;
        if (done) shareBtn.classList.remove('d-none');
        addPresetContainer.classList.add('d-none');
    } else {
        addPresetContainer.classList.remove('d-none');
        shareBtn.classList.add('d-none');
    }
}

function createNewExercise(order, name, series, id, checked, len, pos, tempo) {
    const d = document.createElement('div');
    d.classList.add('py-1');
    let icon = notCheckedSVG;
    if (checked === false) icon = pendingSVG;
    if (checked === true) icon = checkedSVG;
    d.innerHTML = `
    <a class="list-group-item d-flex gap-2 px-2 py-0 rounded align-items-center border-0 shadow-sm" style="height: 5rem">
    <span class="align-self-center ms-auto px-1">
        ${icon}    
    </span>
        <span class="pt-1 form-checked-content w-100 fs-6" data-id="${id}" id="start-${id}">
            <strong style="white-space: nowrap;
            text-overflow: ellipsis;
            width: 70vw;
            display: block;
            overflow: hidden;">${name}</strong>
            <small class="d-block text-muted mt-1"><span class="fw-bold">Orden: ${order}</span> - Series: ${series} - Tempo: ${tempo}</small>
        </span>
        <span class="align-self-center ms-auto">
        <div class="btn-group">
            <button class="btn border-0 p-0 pe-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="options-${id}" href="javascript:void(0);">
                <svg  xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="var(--dark-gray)" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
            <ul class="dropdown-menu text-center  shadow-sm">
                <li>
                    <button type="button" class="option px-1 my-1 w-75 d-flex gap-3 align-items-center ms-2 border-0" id="edit-${id}" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--blue)" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                        Editar
                    </button>
                </li>
                <li>
                    <button type="button" class="option px-1 my-1 w-75 d-flex gap-3 align-items-center ms-2 border-0" id="historic-${id}" data-id="${id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--blue)" class="bi bi-journal-text" viewBox="0 0 16 16">
                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                    </svg>
                        Histórico
                    </button>
                </li>
                <li>
                    <button type="button" class="d-none option px-1 my-1 w-75 d-flex gap-3 align-items-center ms-2 border-0" id="up-${id}" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--blue)" class="bi bi-arrow-up" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                        </svg>
                        Subir
                    </button>
                </li>
                <li>
                    <button type="button" class="d-none option px-1 my-1 w-75 d-flex gap-3 align-items-center ms-2 border-0" id="down-${id}" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--blue)" class="bi bi-arrow-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                        </svg>
                        Bajar
                    </button>
                </li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li class="">
                    <button type="button" class="option px-1 w-75 d-flex gap-3 align-items-center ms-2 border-0" id="delete-${id}" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--red)"" class="bi bi-eraser" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                        </svg>
                        Eliminar
                    </button>
                </li>
            </ul>
            </div>
        </span>
    </a>
    `;
    listaEjercicios.style.height = '110%';
    listaEjercicios.appendChild(d);
    const start = document.getElementById(`start-${id}`);

    start.onclick = () => {
        localStorage.setItem('current', start.getAttribute('data-id'));
        location.href = "html/log-exercise.html";
    }

    const del = document.getElementById(`delete-${id}`);

    del.onclick = () => {
        const ejercicios = getExercises();
        const index = ejercicios.findIndex(x => x.id == del.getAttribute('data-id'));
        ejercicios.splice(index, 1);
        localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
        loadExercises();
        if (ejercicios.length <= 0) {
            addPresetContainer.classList.remove('d-none');
            shareBtn.classList.add('d-none');
        }
    }
    const edit = document.getElementById(`edit-${id}`);

    edit.onclick = () => {
        localStorage.setItem('current-edit', edit.getAttribute('data-id'));
        location.href = "html/add-exercise.html";
    }

    const historic = document.getElementById(`historic-${id}`);
    historic.onclick = () => {
        localStorage.setItem('exercise-to-view', JSON.stringify({ id: id, copy: false }));
        location.href = "html/view-data.html";
    }

    const up = document.getElementById(`up-${id}`);
    const down = document.getElementById(`down-${id}`);
    if (pos > 0) up.classList.remove('d-none');
    if (pos < len - 1) down.classList.remove('d-none')

    up.onclick = () => {
        const ejercicios = getExercises();
        swapPositions(ejercicios, pos, pos - 1);
        localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
        loadExercises();
    }
    down.onclick = () => {
        const ejercicios = getExercises();
        swapPositions(ejercicios, pos, pos + 1);
        localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
        loadExercises();
    }
}

const swapPositions = (array, a, b) => {
    [array[a], array[b]] = [array[b], array[a]]
}

document.querySelectorAll('.w-share').forEach(btn => {
    btn.addEventListener('click', () => share(btn))
});

function share(btn) {
    const ejercicios = getExercises();
    const entrenamiento = JSON.parse(localStorage.getItem('entrenamiento'));
    const text = ejercicios.map(ejercicio => json2csv(ejercicio, entrenamiento)).join('');
    btn.href = `https://wa.me?text=${encodeURIComponent(text)}`;
}

function json2csv(ob, datosEntrenamiento) {
    const date = new Date().toLocaleDateString('en-GB');
    const entrenamientoID = datosEntrenamiento.id || '';
    const entrenamientoTipo = datosEntrenamiento.tipo || '';
    const ejercicioID = ob.id;
    const ejercicio = ob.nombre;
    const orden = ob.orden || '';
    const series = ob.series || '';
    const tempo = ob.isometrico ? ob.tempo : ob.tempo.reduce((prev, curr) => prev + curr, '');
    const objetivo = ob.objetivo;
    const mesociclo = datosEntrenamiento.mesociclo;
    const tipo = 'Peso';
    const sensacionAitor = ob.aitorSensacion || '';
    const sensacionMoi = ob.moiSensacion || '';

    let repsAitor = ';;;;;';
    let repsMoi = ';;;;;';
    if (ob.aitor) repsAitor = `${ob.repeticiones[0] || ''};${ob.aitor[0] || ''};${ob.repeticiones[1] || ''};${ob.aitor[1] || ''};${ob.repeticiones[2] || ''};${ob.aitor[2] || ''};${ob.repeticiones[3] || ''};${ob.aitor[3] || ''};${ob.repeticiones[4] || ''};${ob.aitor[4] || ''}`;
    if (ob.moi) repsMoi = `${ob.repeticiones[0] || ''};${ob.moi[0] || ''};${ob.repeticiones[1] || ''};${ob.moi[1] || ''};${ob.repeticiones[2] || ''};${ob.moi[2] || ''};${ob.repeticiones[3] || ''};${ob.moi[3] || ''};${ob.repeticiones[4] || ''};${ob.moi[4] || ''}`;

    const aitor = `${date};${entrenamientoID};${mesociclo};${entrenamientoTipo};${orden};${ejercicioID};${ejercicio};${series};${tempo};${objetivo};Aitor;${tipo};${repsAitor};${sensacionAitor}`;
    const moi = `${date};${entrenamientoID};${mesociclo};${entrenamientoTipo};${orden};${ejercicioID};${ejercicio};${series};${tempo};${objetivo};Moi;${tipo};${repsMoi};${sensacionMoi}`;

    return aitor + '\r\n' + moi + '\r\n';
}

function compare(a, b) {
    if (a.orden < b.orden) return -1;
    if (a.orden > b.orden) return 1;
    return 0;
}

function getExercises() {
    const tmp = localStorage.getItem('ejercicios');
    if (tmp) return JSON.parse(tmp);
    return false;
}