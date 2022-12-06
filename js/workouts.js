import getFile from './data.js';
const workoutsContainer = document.getElementById('workouts-container');
const mesocicloSelect = document.getElementById('mesociclo-select');
const tipoSelect = document.getElementById('tipo-select');
const clearFilters = document.getElementById('clear-filters');
let WORKOUTS;

const upSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
class="bi bi-caret-up-fill" viewBox="0 0 16 16">
<path
    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
</svg>`;

const downSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
</svg>`;


mesocicloSelect.onchange = () => {
    createAllCards(filters(mesocicloSelect.value, tipoSelect.value));
    if (mesocicloSelect.value != 0) {
        mesocicloSelect.classList.remove('bg-white');
        mesocicloSelect.classList.add('b-blue', 'text-white', 'custom-select');
        clearFilters.classList.remove('bg-white');
        clearFilters.classList.add('b-blue', 'text-white');
    } else {
        mesocicloSelect.classList.add('bg-white');
        mesocicloSelect.classList.remove('b-blue', 'text-white', 'custom-select');
        clearFilters.classList.add('bg-white');
        clearFilters.classList.remove('b-blue', 'text-white');
    }
}
tipoSelect.onchange = () => {
    createAllCards(filters(mesocicloSelect.value, tipoSelect.value));
    if (tipoSelect.value != 0) {
        tipoSelect.classList.remove('bg-white');
        tipoSelect.classList.add('b-blue', 'text-white', 'custom-select');
        clearFilters.classList.remove('bg-white');
        clearFilters.classList.add('b-blue', 'text-white');
    } else {
        tipoSelect.classList.add('bg-white');
        tipoSelect.classList.remove('b-blue', 'text-white', 'custom-select');
        clearFilters.classList.add('bg-white');
        clearFilters.classList.remove('b-blue', 'text-white');
    }
}

clearFilters.onclick = () => {
    mesocicloSelect.value = '0';
    tipoSelect.value = '0';
    mesocicloSelect.onchange();
    tipoSelect.onchange();
    clearFilters.classList.add('bg-white');
    clearFilters.classList.remove('b-blue', 'text-white');
}

getContext();
async function getContext() {

    WORKOUTS = await getFile('workouts.json');
    WORKOUTS = WORKOUTS.data;
    mesocicloSelect.value = '2';
    clearFilters.classList.remove('bg-white');
    clearFilters.classList.add('b-blue', 'text-white');
    mesocicloSelect.onchange();
    createAllCards(filters(mesocicloSelect.value, tipoSelect.value));

}

function filters(mesociclo, tipo) {
    let filtered = WORKOUTS;
    if (mesociclo != 0) filtered = filtered.filter(workout => workout.mesociclo == mesociclo)
    if (tipo != 0) filtered = filtered.filter(workout => workout.tipo == tipo);
    return filtered;
}

function createAllCards(workouts) {
    workoutsContainer.innerHTML = '';
    console.log(workouts)
    if (workouts.length) {
        workouts.forEach(element => {
            createCard(element.entrenamiento, element.tipo, element.ejercicios, element.mesociclo)
        });
    } else {
        const d = document.createElement('div');
        d.classList.add('text-muted', 'fs-7', 'fw-bold', 'justify-content-center', 'd-flex');
        d.style.marginTop = '40vh';
        d.innerHTML = 'No hay datos';
        workoutsContainer.append(d)
    }
}

function createCard(name, type, exercises, mesociclo) {
    const iconColor = type == 'carga' ? 't-dark-green' : 't-dark-blue';
    const textBacground = type == 'carga' ? 'b-light-green' : 'b-light-blue';
    const svg = type == 'carga' ? upSVG : downSVG;

    const tipo = type.charAt(0).toUpperCase() + type.slice(1);

    const a = document.createElement('a');
    a.classList.add('bg-white', 'list-group-item', 'd-flex', 'gap-2', 'p-2', 'py-3', 'rounded', 'align-items-center', 'border-0', 'shadow-sm', 'mt-1', 'mb-2');
    a.style.height = '5.3rem';

    const card = `
            <span class="form-checked-content w-100 fs-4">
                <div class="d-flex gap-2">
                    <span class="${iconColor} d-flex align-items-center justify-content-center rounded-4 w-100"
                        style="width: 2rem!important; height: 2rem;">
                        ${svg}
                    </span>
                    <div style="white-space: nowrap;
                text-overflow: ellipsis;
                width: 70vw;
                display: block;
                overflow: hidden;" class="fs-6 align-self-center">Entrenamiento <span class="fw-bold">${name}</span></div>
                <div>
                    <a href=workout-details.html>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        </svg>
                    </a>
                </div>
                </div>
                <div class="d-flex mt-2 gap-2 py-0">
                    <div class="rounded-1 ${textBacground} w-50 text-center">
                        <div class="fs-7 fw-bold">${exercises.length}</div>
                        <div class="fs-8 text-muted fw-bold">Ejercicios</div>
                    </div>
                    <div class="rounded-1 ${textBacground} w-50 text-center">
                        <div class="fs-7 fw-bold">${mesociclo}</div>
                        <div class="fs-8 text-muted fw-bold">Mesociclo</div>
                    </div>
                    <div class="rounded-1 ${textBacground} w-50 align-items-center d-flex justify-content-center">
                        <div class="fs-7 fw-bold">${tipo}</div>
                    </div>
                </div>
            </span>    
    `;

    a.innerHTML = card;
    a.onclick = () => {
        localStorage.removeItem('ejercicios');
        localStorage.removeItem('entrenamiento');
        localStorage.setItem('entrenamiento', `{"tipo": "${tipo}", "id": "${name}"}`);
        localStorage.setItem('ejercicios', JSON.stringify(exercises));
        location.href = '../index.html';
    }

    workoutsContainer.append(a);
}