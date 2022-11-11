const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const tempos = [...document.querySelectorAll('input[name="tempo"]')];
const repsContainer = document.getElementById('reps-container');
const aitorWeightContainer = document.getElementById('aitor-weight-container');
const moiWeightContainer = document.getElementById('moi-weight-container');
const objetivo = document.getElementById('objective');

const spreadMoi = document.getElementById('spread-moi');
const resetMoi = document.getElementById('reset-moi');
spreadMoi.onclick = () => {
    const pesosMoi = [...document.querySelectorAll('input[name="peso-moi"]')];
    const pesoDuplicar = pesosMoi.findLast(x => x.value !== '').value;
    pesosMoi.forEach(peso => peso.value = peso.value ? peso.value : pesoDuplicar);
    isSeriesCompleted('moi');
}
resetMoi.onclick = () => {
    [...document.querySelectorAll('input[name="peso-moi"]')].forEach(i => i.value = '');
    isSeriesCompleted('moi');
}


const spreadAitor = document.getElementById('spread-aitor');
const resetAitor = document.getElementById('reset-aitor');
spreadAitor.onclick = () => {
    const pesosAitor = [...document.querySelectorAll('input[name="peso-aitor"]')];
    const pesoDuplicar = pesosAitor.findLast(x => x.value !== '').value;
    pesosAitor.forEach(peso => peso.value = peso.value ? peso.value : pesoDuplicar);
    isSeriesCompleted('aitor');
}

resetAitor.onclick = () => {
    [...document.querySelectorAll('input[name="peso-aitor"]')].forEach(i => i.value = '');
    isSeriesCompleted('aitor');
}

const video = document.getElementById('video');
const videoIcon = document.getElementById('video-icon');

const retrieve = document.getElementById('retrieve');

const modalBody = document.querySelector('.modal-body')

retrieve.onclick = () => {

    localStorage.setItem('exercise-to-view', JSON.stringify({ id: current.id, copy: true }));
    retrieve.href = 'view-data.html';
    // const historic = JSON.parse(localStorage.getItem('historic'));
    // if (historic) {

    //     const lastMoiCarga = getLast(current.id, 'Moi', 'Carga');
    //     const lastMoiDescarga = getLast(current.id, 'Moi', 'Descarga');
    //     const lastAitorCarga = getLast(current.id, 'Aitor', 'Carga');
    //     const lastAitorDescarga = getLast(current.id, 'Aitor', 'Descarga');

    //     const textLastAitorDescarga = lastAitorDescarga ? lastAitorDescarga.Peso1 : 'N/A';
    //     const textLastMoiDescarga = lastMoiDescarga ? lastMoiDescarga.Peso1 : 'N/A';
    //     modalBody.innerHTML =

    //         `
    //     <div class="fw-bold">Aitor<div>
    //     <ul class="fw-normal">
    //         <li>Último peso carga: ${lastAitorCarga.Peso1}</li>
    //         <li>Último peso descarga: ${textLastAitorDescarga}</li>
    //     </ul>
    //     <hr>
    //     <div class="fw-bold">Moi<div>
    //     <ul class="fw-normal">
    //         <li>Último peso carga: ${lastMoiCarga.Peso1}</li>
    //         <li>Último peso descarga: ${textLastMoiDescarga}</li>
    //     </ul>

    //     `
    // }
}

const homeBtn = document.getElementById('home');

homeBtn.onclick = () => {
    current.aitor = [...document.querySelectorAll('input[name="peso-aitor"]')].map(x => x.value);
    current.moi = [...document.querySelectorAll('input[name="peso-moi"]')].map(x => x.value);

    current.completado = (isSeriesCompleted('aitor') && isSeriesCompleted('moi')) ? true : false;
    if (isSeriesEmpty('aitor') && isSeriesEmpty('moi')) current.completado = null;
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));

    // const newCurent = ejercicios.filter(x => x.completado !== true)[0];
    // if (current.completado && newCurent) {
    //     localStorage.setItem('current', newCurent.id);
    // } else {
    homeBtn.href = '../index.html';
    // }
}

const tempo = document.getElementById('tempo')

let current;
let ejercicios;

loadData();
function loadData() {
    getContext();
    ejercicio.innerHTML = current.nombre;
    const fecha = current.fecha ? current.fecha.split(',')[0] : 'N/D';
    const hora = current.fecha ? current.fecha.split(',')[1] : 'N/D';
    const tipo = current.tipo ? current.tipo : 'N/D';

    document.querySelector('.accordion-body').innerHTML = `
    <div class="badge rounded-pill bg-dark">Orden: ${current.orden}</div>
    <div class="badge rounded-pill bg-success">Id: ${current.id}</div>
    <div class="badge rounded-pill bg-success">Tipo: ${tipo}</div>
    <div class="badge rounded-pill bg-success">Video: ${current.video ? 'Sí' : 'No'}</div>
    <div class="badge rounded-pill bg-success">Fecha: ${fecha}</div>
    <div class="badge rounded-pill bg-success">Hora: ${hora}</div>
    `;
    if (current.isometrico) {
        tempo.innerHTML = current.tempo;
    } else {
        tempo.innerHTML = current.tempo.reduce((prev, curr) => prev + curr);
    }
    objetivo.value = current.objetivo;
    createReps(current.series, current.isometrico);
    document.getElementById('series').innerHTML = current.series;
    [...document.getElementsByName('reps')].forEach((x, i) => x.innerHTML = current.repeticiones[i]);
    createPeso(current.series, 'aitor', current.tipo);
    createPeso(current.series, 'moi', current.tipo);


    if (current.aitor) [...document.querySelectorAll('input[name="peso-aitor"]')].forEach((x, i) => x.value = current.aitor[i])
    if (current.moi) [...document.querySelectorAll('input[name="peso-moi"]')].forEach((x, i) => x.value = current.moi[i])

    delay(10).then(() => console.log('ran after 1 second1 passed'));

    const dataToCopy = JSON.parse(localStorage.getItem('data-to-copy'));
    if (dataToCopy) {
        [...document.querySelectorAll('input[name="peso-aitor"]')].forEach((x, i) => x.value = dataToCopy.pesosAitor[i]);
        [...document.querySelectorAll('input[name="peso-moi"]')].forEach((x, i) => x.value = dataToCopy.pesosMoi[i]);
    }

    isSeriesCompleted('moi');
    isSeriesCompleted('aitor');

    localStorage.removeItem('data-to-copy');

}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function isSeriesCompleted(user) {
    const seriesValues = [...document.querySelectorAll(`input[name="peso-${user}"]`)];
    const isCompleted = seriesValues.filter(x => x.value == '').length > 0 ? false : true;
    if (isCompleted) {
        document.getElementById(`container-${user}`).style.setProperty('border', '1px solid var(--light-green)', 'important');;
        document.getElementById(`badge-${user}`).classList.remove('d-none');
    } else {
        document.getElementById(`container-${user}`).style.setProperty('border', '1px solid #dee2e6', 'important');;
        document.getElementById(`badge-${user}`).classList.add('d-none');
    }

    return isCompleted;
}

function isSeriesEmpty(user) {
    return [...document.querySelectorAll(`input[name="peso-${user}"]`)].every(x => x.value === '');
}

function getContext() {
    const id = localStorage.getItem('current');
    ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    if (!ejercicios) window.location.href = "../index.html";

    current = ejercicios.filter(ejercicio => ejercicio.id == id)[0];

    let listaEjercicios = localStorage.getItem('listaEjercicios');
    if (listaEjercicios) {
        listaEjercicios = JSON.parse(listaEjercicios);
        const ejercicioActual = listaEjercicios.data.filter(x => x.id == id)[0];
        if (ejercicioActual.video) {
            video.disabled = false;
            videoIcon.style.fill = '#ff0000';
            video.href = ejercicioActual.video;
        } else {
            video.disabled = true;
            videoIcon.style.fill = '#111827';
        }
        current.tipo = ejercicioActual.tipo;
        current.video = ejercicioActual.video;
        current.fecha = listaEjercicios.date;
    }

    return current;
}

function createReps(num, isometrico) {
    repsContainer.innerHTML = '';
    const text = isometrico ? 'Segundos' : 'Reps';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('flex-fill', 'w-50', 'bg-white', 'border', 'rounded-1', 'px-2', 'py-1')
        div.innerHTML = `<div for="reps-${i}" class="text-muted fw-bold fs-7">${text} ${i}</div>
        <div class="fw-bolder fs-5" name="reps" id="reps-${i}">5</div>`;
        repsContainer.appendChild(div);
    }
}

function createPeso(num, user, tipo) {
    if (user == 'aitor') aitorWeightContainer.innerHTML = '';
    if (user == 'moi') moiWeightContainer.innerHTML = '';
    num++;
    if (tipo == 'Repeticiones') tipo = 'Reps'

    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<label for="${user}-${i}" class="fs-7 fw-bold d-flex">${tipo} ${i}</label>
        <input type="number" class="form-control" id="${user}-${i}" placeholder="" value="" required="" name="peso-${user}">`;
        if (user == 'aitor') aitorWeightContainer.appendChild(div);
        if (user == 'moi') moiWeightContainer.appendChild(div);
    }
    document.querySelectorAll(`input[name="peso-${user}"]`).forEach(x => x.addEventListener('input', () => {
        isSeriesCompleted(user);
    }))
}

function getLast(id, user, tipoEntrenamiento) {
    const historic = JSON.parse(localStorage.getItem('historic'));
    if (historic) return [...historic.data.filter(x => x.EjercicioID == id && x.Usuario == user && x.TipoEntrenamiento == tipoEntrenamiento)].pop();
    return false;
}

