const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const tempos = [...document.querySelectorAll('input[name="tempo"]')];
const repsContainer = document.getElementById('reps-container');
const aitorWeightContainer = document.getElementById('aitor-weight-container');
const moiWeightContainer = document.getElementById('moi-weight-container');
const objetivo = document.getElementById('objective');

const retrieve = document.getElementById('retrieve');

const modalBody = document.querySelector('.modal-body')

retrieve.onclick = () => {
    const historic = JSON.parse(localStorage.getItem('historic'));
    if (historic) {

        const lastMoiCarga = [...historic.data.filter(x => x.EjercicioID == current.id && x.Usuario == 'Moi' && x.TipoEntrenamiento == 'Carga')].pop();
        let lastMoiDescarga = [...historic.data.filter(x => x.EjercicioID == current.id && x.Usuario == 'Moi' && x.TipoEntrenamiento == 'Descarga')].pop();
        const lastAitorCarga = [...historic.data.filter(x => x.EjercicioID == current.id && x.Usuario == 'Aitor' && x.TipoEntrenamiento == 'Carga')].pop();
        let lastAitorDescarga = [...historic.data.filter(x => x.EjercicioID == current.id && x.Usuario == 'Aitor' && x.TipoEntrenamiento == 'Descarga')].pop();

        const textLastAitorDescarga = lastAitorDescarga ? lastAitorDescarga.Peso1 : 'N/A';
        const textLastMoiDescarga = lastMoiDescarga ? lastMoiDescarga.Peso1 : 'N/A';
        modalBody.innerHTML =

            `
        <div class="fw-bold">Aitor<div>
        <ul class="fw-normal">
            <li>Último peso carga: ${lastAitorCarga.Peso1}</li>
            <li>Último peso descarga: ${textLastAitorDescarga}</li>
        </ul>
        <hr>
        <div class="fw-bold">Moi<div>
        <ul class="fw-normal">
            <li>Último peso carga: ${lastMoiCarga.Peso1}</li>
            <li>Último peso descarga: ${textLastMoiDescarga}</li>
        </ul>
        
        `
    }
}

const saveBtn = document.getElementById('save');

saveBtn.onclick = () => {
    current.aitor = [...document.querySelectorAll('input[name="peso-Aitor"]')].map(x => x.value)
    current.moi = [...document.querySelectorAll('input[name="peso-Moi"]')].map(x => x.value)
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));

    const newCurent = ejercicios.filter(x => x.moi == undefined)[0];
    if (newCurent) {
        localStorage.setItem('current', newCurent.id);
    } else {
        saveBtn.href = '../index.html';
    }
}

const tempo = document.getElementById('tempo')

let current;
let ejercicios;

loadData();
function loadData() {
    getContext();
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


    if (current.aitor) [...document.querySelectorAll('input[name="peso-Aitor"]')].forEach((x, i) => x.value = current.aitor[i])
    if (current.moi) [...document.querySelectorAll('input[name="peso-Moi"]')].forEach((x, i) => x.value = current.moi[i])

}

function getContext() {
    const id = localStorage.getItem('current');
    ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    if (!ejercicios) window.location.href = "../index.html";

    current = ejercicios.filter(ejercicio => ejercicio.id == id)[0];
    return current;
}

function createReps(num) {
    repsContainer.innerHTML = '';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<label for="reps-${i}" class="form-label fw-bold">Rep ${i}</label>
        <input type="text" class="form-control" id="reps-${i}" placeholder="" value="" required="" name="reps" maxlength="2" disabled>`;
        repsContainer.appendChild(div);
    }
}

function createPeso(num, user) {
    if (user == 'Aitor') aitorWeightContainer.innerHTML = '';
    if (user == 'Moi') moiWeightContainer.innerHTML = '';
    num++;

    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<label for="${user}-${i}" class="form-label fw-bold">Peso ${i}</label>
        <input type="text" class="form-control" id="${user}-${i}" placeholder="" value="" required="" name="peso-${user}">`;
        if (user == 'Aitor') aitorWeightContainer.appendChild(div);
        if (user == 'Moi') moiWeightContainer.appendChild(div);
    }
}


function gesLast(id, user) {
    const data = JSON.parse(localStorage.getItem('historic'));
    if (data) return [...data.filter(x => x.EjercicioID == id && x.Usuario == user)].pop();
}

// let height = window.innerHeight;
// window.addEventListener("resize", (e) => {
//     let newHeight = window.innerHeight;
//     if(newHeight > height) document.querySelector("html").style.height = '100%';
//     if(newHeight < height) document.querySelector("html").style.height = '150%';
//     console.log('resize')
// });