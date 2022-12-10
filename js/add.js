import getFile from './data.js';

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let title = localStorage.getItem("theme");
    if (title) setActiveStyleSheet(title);
});
function setActiveStyleSheet(title) {
    /* Grab a list of all alternate style sheets */
    let css = `link[rel="alternate stylesheet"]`;
    let stylesheets = document.querySelectorAll(css);
    /* Walk all alternate style sheets and disable them */
    stylesheets.forEach(sheet => sheet.disabled = true);
    /* Select style sheet we want to "turn on" */
    let selector = `link[title="${title}"]`;
    let stylesheet = document.querySelector(selector);
    /* Enable the style sheet */
    stylesheet.disabled = false;
    localStorage.setItem("theme", title);
}

const orden = document.getElementById('order');
const ejercicioSelect = document.getElementById('exe');
const ejercicioSearch = document.getElementById('exercise-search');
const objetivo = document.getElementById('objective');
const repsContainer = document.getElementById('reps-container');

const series = document.querySelectorAll('input[name="series"]');
series.forEach(serie => serie.onclick = () => createReps(document.querySelector('input[name="series"]:checked').value));
const isometric = document.getElementById('isometric');
const isometricNo = document.getElementById('isometric-no');

const searchExerciseText = document.getElementById('search-exercise-text');

let tmp;

ejercicioSelect.onmousedown = (e) => {
    e.preventDefault();
}
const myModal = document.getElementById('modalSearchExercise')

myModal.addEventListener('shown.bs.modal', function () {
    searchExerciseText.focus()
})

searchExerciseText.oninput = () => {
    ejercicioSearch.innerHTML = '';
    const ejerciciosEncontrados = find(JSON.parse(localStorage.getItem('listaEjercicios')).data, searchExerciseText.value);

    ejerciciosEncontrados.forEach(ejercicio => {
        const option2 = document.createElement('li');
        option2.innerHTML = `
        <div class="dropdown-item text-wrap d-flex align-items-center gap-2 py-2" data-tipo="${ejercicio.tipo}" data-id="${ejercicio.id}">
        <span class="d-inline-block bg-success rounded-circle p-1"></span>
        <span class="capitalize-first">${ejercicio.ejercicio}</span>
        </div>
        `;
        option2.onclick = () => {
            ejercicioSelect.value = ejercicio.id;
            const modal = bootstrap.Modal.getInstance(myModal);
            modal.hide();
        }
        ejercicioSearch.appendChild(option2);
    });

    if (ejerciciosEncontrados.length === 0) {
        const option2 = document.createElement('li');
        option2.innerHTML = `
        <div class="dropdown-item text-wrap d-flex align-items-center py-2 gap-2 t-red" disabled>
        <span class="d-inline-block bg-danger rounded-circle p-1"></span>
        No hay ejercicios para esa búsqueda
        </div>
        `;
        ejercicioSearch.appendChild(option2);

    }
};

function find(items, text) {
    return items.filter(item => {
        if (item.ejercicio.toLowerCase().includes(text.toLowerCase())) {
            item.ejercicio = item.ejercicio.toLowerCase().replaceAll(text.toLowerCase(), `<strong><mark class="p-0">${text}</mark></strong>`);
            return item;
        }
        return false;
    });
}

createOptions();
async function createOptions() {
    const listaEjercicios = JSON.parse(localStorage.getItem('listaEjercicios'));
    if (listaEjercicios) {
        listaEjercicios.data.forEach(ejercicio => {
            const option = document.createElement('option');
            option.value = ejercicio.id;
            option.innerHTML = ejercicio.ejercicio;
            option.dataset.tipo = ejercicio.tipo;
            ejercicioSelect.appendChild(option);

            let ejercicioIcon = '<span class="d-inline-block bg-success rounded-circle p-1"></span>';

            if (ejercicio.elemento == 'mancuerna') {
                ejercicioIcon = `<svg style="width: 14px!important; height: 14px!important;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--dark-gray)" class="bi" viewBox="0 0 640 512"><path d="M112 96c0-17.7 14.3-32 32-32h16c17.7 0 32 14.3 32 32V224v64V416c0 17.7-14.3 32-32 32H144c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32h48V96zm416 0v32h48c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H528v32c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 96c0-17.7 14.3-32 32-32h16c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/></svg>`
            } else if (ejercicio.elemento == 'cuerpo') {
                ejercicioIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--dark-gray)" class="bi" viewBox="0 0 384 512"><path d="M256 64c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4V480c0 17.7 14.3 32 32 32s32-14.3 32-32V384h32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V221.6c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z"/></svg>                `;
            } else if (ejercicio.elemento == 'polea') {
                ejercicioIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="var(--dark-gray)" class="bi bi-gear-fill" viewBox="0 0 16 16">
                                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                                 </svg>`;
            } else if (ejercicio.elemento == 'barra') {
                ejercicioIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-slash-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                </svg>`;
            } else if (ejercicio.elemento == 'maquina') {
                ejercicioIcon = `
                <svg xmlns="http://www.w3.org/2000/svg"width="14" height="14" fill="var(--dark-gray)" class="bi" viewBox="0 0 512 512"><path d="M288 96c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32zm58.5 32c3.5-10 5.5-20.8 5.5-32c0-53-43-96-96-96s-96 43-96 96c0 11.2 1.9 22 5.5 32H120c-22 0-41.2 15-46.6 36.4l-72 288c-3.6 14.3-.4 29.5 8.7 41.2S33.2 512 48 512H464c14.8 0 28.7-6.8 37.8-18.5s12.3-26.8 8.7-41.2l-72-288C433.2 143 414 128 392 128H346.5z"/></svg>`
            }


            const option2 = document.createElement('li');
            option2.innerHTML = `
            <div class="dropdown-item text-wrap d-flex align-items-center gap-3 py-2" data-tipo="${ejercicio.tipo}" data-id="${ejercicio.id}">
            <span style="width: 14px!important;">${ejercicioIcon}</span>   
            <span>${ejercicio.ejercicio}</span>
            </div>
            `;
            option2.onclick = () => {
                ejercicioSelect.value = ejercicio.id;
                const modal = bootstrap.Modal.getInstance(myModal);
                modal.hide();
            }
            ejercicioSearch.appendChild(option2)
        })
    } else {
        let res = await getFile('exercises.json');
        if (res.ok) {
            localStorage.setItem('listaEjercicios', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: res.data }));
            createOptions();
        } else {
            alert(`Error: ${res.error}`);
        }
    }
}

let currentIndex = null;


const saveButton = document.getElementById('save');
saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (ejercicioSelect.value) {
        SaveDataToLocalStorage(createToken());
    } else {
        alert('Selecciona ejercicio');
        document.getElementById('closeModal').click();
    }
});

let current;

const tempos = [...document.querySelectorAll('input[name="tempo"]')];

tempos.forEach((el, i) => el.onkeyup = () => {
    if (i < tempos.length - 1) {
        if (el.value) tempos[i + 1].focus();
    }
});

loadData();
function loadData() {


    if (getContext()) {
        orden.value = current.orden;
        ejercicioSelect.value = current.id;
        if (current.isometrico) {
            isometric.checked = true;
            isometric.classList.add('active');
            document.getElementById('isometric-label').classList.add('active');
            tempos.forEach(tempo => {
                tempo.disabled = true;
                tempo.value = null;
                tempo.classList.add('d-none')
            });
            updateIsometric();

        } else {
            isometricNo.checked = true;
            document.getElementById('isometric-no-label').classList.add('active');

            tempos.forEach((tempo, i) => {
                tempo.value = current.tempo[i]
                tempo.classList.remove('d-none')
            });
            updateIsometric();

        }
        [...document.querySelectorAll('input[name="series"]')][parseInt(current.series) - 1].checked = true;
        createReps(parseInt(current.series));
        [...document.querySelectorAll('input[name="reps"]')].forEach((x, i) => x.value = current.repeticiones[i]);
        objetivo.value = current.objetivo;
    } else {
        isometricNo.checked = true;
        document.getElementById('isometric-no-label').classList.add('active');
        updateIsometric();
    }
}


function getContext() {
    const id = localStorage.getItem('current-edit');

    if (id) {
        const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
        if (ejercicios) {
            currentIndex = ejercicios.findIndex(ejercicio => ejercicio.id == id);
            current = ejercicios[currentIndex];
        }
    }

    return current;
}

function createToken() {
    const token = new Object();
    token.orden = orden.value;
    token.nombre = ejercicioSelect.options[ejercicioSelect.selectedIndex].text;
    token.id = ejercicioSelect.value;
    token.series = document.querySelector('input[name="series"]:checked').value ? document.querySelector('input[name="series"]:checked').value : alert('Falta indicar serie');
    token.isometrico = isometric.checked;
    token.tempo = isometric.checked ? 'Isométrico' : [...document.querySelectorAll('input[name="tempo"]')].map(x => x.value);
    token.repeticiones = [...document.querySelectorAll('input[name="reps"]')].map(x => x.value)
    token.objetivo = objetivo.value;
    token.tipo = ejercicioSelect.options[ejercicioSelect.selectedIndex].dataset.tipo;
    token.completado = null;
    return token;
}

function SaveDataToLocalStorage(data) {
    let ejercicios = JSON.parse(localStorage.getItem('ejercicios')) || [];
    const newIndex = ejercicios.findIndex(x => x.id == data.id);


    if (currentIndex !== null && currentIndex > -1) {
        if (newIndex !== currentIndex && newIndex > -1) {
            alert(`Ejercicio ya existente, no se puede volver a añadir. ${currentIndex} ${newIndex}`, currentIndex, newIndex);
        } else {
            ejercicios[currentIndex] = data;
        }
    } else {
        if (newIndex > -1) {
            alert(`Ejercicio ya existente, no se puede volver a añadir. ${currentIndex} ${newIndex}`, currentIndex, newIndex);
        } else {
            ejercicios.push(data);
        }
    }
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
}

function createReps(num) {
    repsContainer.innerHTML = '';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('w-100')
        div.innerHTML = `<label for="reps-${i}" class="form-label fs-7 fw-bold">Rep ${i}</label>
        <input type="text" class="form-control form-control-sm flex-fill text-center" id="reps-${i}" placeholder="" value="" required="" name="reps" maxlength="2">`;
        repsContainer.appendChild(div);
    }
    const reps = [...document.querySelectorAll('input[name="reps"]')];
    reps.forEach((el, i) => el.onkeyup = () => {
        if (i < reps.length - 1) {
            if (el.value.length >= 2) reps[i + 1].focus();
        }
    });
}

isometric.onclick = () => {
    isometric.checked = true;
    isometricNo.checked = false;
    document.getElementById('isometric-label').classList.add('active');
    document.getElementById('isometric-no-label').classList.remove('active');


    updateIsometric();
}

isometricNo.onclick = () => {
    isometric.checked = false;
    isometricNo.checked = true;
    document.getElementById('isometric-no-label').classList.add('active');
    document.getElementById('isometric-label').classList.remove('active');

    updateIsometric();
}

function updateIsometric() {
    if (isometric.checked) {
        tmp = tempos.map(x => x.value);
        tempos.forEach(tempo => {
            tempo.disabled = true;
            tempo.value = null;
            tempo.classList.add('d-none');
        });
    } else {
        isometricNo.active = true;
        tempos.forEach((tempo, i) => {
            tempo.disabled = false;
            if (tmp) tempo.value = tmp[i];
            tempo.classList.remove('d-none');
        });
    }
}


