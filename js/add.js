import getFile from './data.js';

const orden = document.getElementById('order');
const ejercicioSelect = document.getElementById('exe');
const ejercicioSearch = document.getElementById('exercise-search');
const objetivo = document.getElementById('objective');
const repsContainer = document.getElementById('reps-container');

const series = document.querySelectorAll('input[name="series"]');
series.forEach(serie => serie.onclick = () => createReps(document.querySelector('input[name="series"]:checked').value));
const isometric = document.getElementById('isometric');

const searchExerciseText = document.getElementById('search-exercise-text');

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


            const option2 = document.createElement('li');
            option2.innerHTML = `
            <div class="dropdown-item text-wrap d-flex align-items-center gap-2 py-2" data-tipo="${ejercicio.tipo}" data-id="${ejercicio.id}">
            <span class="d-inline-block bg-success rounded-circle p-1"></span>
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
            tempos.forEach(tempo => {
                tempo.disabled = true;
                tempo.value = null;
            });
        } else {
            tempos.forEach((x, i) => x.value = current.tempo[i]);
        }
        [...document.querySelectorAll('input[name="series"]')][parseInt(current.series) - 1].checked = true;
        createReps(parseInt(current.series));
        [...document.querySelectorAll('input[name="reps"]')].forEach((x, i) => x.value = current.repeticiones[i]);
        objetivo.value = current.objetivo;
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
    if (currentIndex !== null) {
        if (ejercicios.filter(x => x.id == data.id)[0]) {
            alert('Ejercicio ya existente, no se puede volver a añadir');
        } else {
            ejercicios[currentIndex] = data;
        }
    } else {
        ejercicios.push(data);
    }
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
}

function createReps(num) {
    repsContainer.innerHTML = '';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<label for="reps-${i}" class="form-label fw-bold">Rep ${i}</label>
        <input type="text" class="form-control form-control-sm" id="reps-${i}" placeholder="" value="" required="" name="reps" maxlength="2">`;
        repsContainer.appendChild(div);
    }
    const reps = [...document.querySelectorAll('input[name="reps"]')];
    reps.forEach((el, i) => el.onkeyup = () => {
        if (i < reps.length - 1) {
            if (el.value.length >= 2) reps[i + 1].focus();
        }
    });
}

let tmp;
isometric.onchange = () => {
    if (isometric.checked) {
        tmp = tempos.map(x => x.value);
        tempos.forEach(tempo => {
            tempo.disabled = true;
            tempo.value = null;
        });
    } else {
        tempos.forEach((tempo, i) => {
            tempo.disabled = false;
            tempo.value = tmp[i];
        });
    }
}


