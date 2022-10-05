const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const tempos = [...document.querySelectorAll('input[name="tempo"]')];
const repsContainer = document.getElementById('reps-container');
const aitorWeightContainer = document.getElementById('aitor-weight-container');
const moiWeightContainer = document.getElementById('moi-weight-container');
const objetivo = document.getElementById('objective');

const saveBtn = document.getElementById('save');

saveBtn.onclick = () => {

    current.aitor = [...document.querySelectorAll('input[name="peso-Aitor"]')].map(x => x.value)
    current.moi = [...document.querySelectorAll('input[name="peso-Moi"]')].map(x => x.value)
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
}

const tempo = document.getElementById('tempo')

let current;
let ejercicios;

loadData();
function loadData() {
    getContext();
    console.log(getContext())
    ejercicio.value = current.nombre;
    if (current.isometrico) {
        tempo.value = current.tempo;
    } else {
        tempo.value = current.tempo.reduce((prev, curr) => prev + curr);
    }
    objetivo.value = current.objetivo;   
    [...document.querySelectorAll('input[name="series"]')][parseInt(current.series) - 1].checked = true;
    createReps(current.series);
    [...document.querySelectorAll('input[name="reps"]')].forEach((x, i) => x.value = current.repeticiones[i]);
    createPeso(current.series, 'Aitor');
    createPeso(current.series, 'Moi');


    if (current.aitor) [...document.querySelectorAll('input[name="peso-Aitor"]')].forEach((x,i) => x.value = current.aitor[i])
    if (current.moi) [...document.querySelectorAll('input[name="peso-Moi"]')].forEach((x,i) => x.value = current.moi[i])
    
}

function getContext() {
    const id = localStorage.getItem('current');
    ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    if(!ejercicios) window.location.href = "index.html";

    current = ejercicios.filter(ejercicio => ejercicio.id == id)[0];
    return current;
}

function createReps(num) {
    repsContainer.innerHTML = '';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('col-3');
        div.innerHTML = `<label for="reps-${i}" class="form-label fw-bold">Rep ${i}</label>
        <input type="text" class="form-control" id="reps-${i}" placeholder="" value="" required="" name="reps" maxlength="2" disabled>`;
        repsContainer.appendChild(div);
    }
    const reps = [...document.querySelectorAll('input[name="reps"]')];
    reps.forEach((el, i) => el.onkeyup = () => {
        if (i < reps.length - 1) {
            if (el.value.length >= 2) reps[i + 1].focus();
        }
    });
}

function createPeso(num, user) {
    if (user == 'Aitor') aitorWeightContainer.innerHTML = '';
    if (user == 'Moi') moiWeightContainer.innerHTML = '';
    num++;

    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('col-3');
        div.innerHTML = `<label for="${user}-${i}" class="form-label fw-bold">Peso ${i}</label>
        <input type="text" class="form-control" id="${user}-${i}" placeholder="" value="" required="" name="peso-${user}">`;
        if (user == 'Aitor') aitorWeightContainer.appendChild(div);
        if (user == 'Moi') moiWeightContainer.appendChild(div);
    }
}