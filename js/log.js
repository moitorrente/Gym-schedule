const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const tempos = [...document.querySelectorAll('input[name="tempo"]')];
const repsContainer = document.getElementById('reps-container');
const aitorWeightContainer = document.getElementById('aitor-weight-container');
const moiWeightContainer = document.getElementById('moi-weight-container');
const objetivo = document.getElementById('objective');

const playBtn = document.getElementById('play-btn');
const playTxt = document.getElementById('play-text');
const timerDisplay = document.getElementById('timer-display')

const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-stop-fill" viewBox="0 0 16 16">
    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
  </svg>`;

const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play" viewBox="0 0 16 16">
    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
</svg>`;


playBtn.onclick = () => {
    if (int) {
        clearInterval(int);
        int = null;
        playBtn.innerHTML = playSVG;
        playTxt.innerHTML = parseInt([...document.getElementsByName('reps')][0].innerHTML);
        timerDisplay.innerHTML = '';
        timerDisplay.classList.add('d-none');
    } else {
        playBtn.innerHTML = pauseSVG;
        timerDisplay.classList.remove('d-none');
        startTimer(parseInt([...document.getElementsByName('reps')][0].innerHTML));
    }
}

function beep() {
    const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
    if (window.navigator && window.navigator.vibrate) {
        navigator.vibrate(1000);
    } else {
        // Not supported
    }
}

let int;

function startTimer(duration) {
    clearInterval(int)
    var timer = duration, minutes, seconds;
    seconds = parseInt(timer % 60, 10);
    timerDisplay.innerHTML = '';
    for (let i = 0; i < seconds; i++) {
        const s = document.createElement('span');
        s.classList.add('d-inline-block', 'b-light-blue', 'rounded-circle', 'p-1', 'dot');
        timerDisplay.appendChild(s);
    }
    int = setInterval(function () {

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        const dot = document.querySelector('.dot');
        if (dot) {
            dot.classList.remove('dot', 'b-light-blue');
            dot.classList.add('bg-primary');
        }
        playTxt.innerHTML = seconds;

        if (--timer < 0) {
            clearInterval(int);
            beep();
            int = null;
            playBtn.innerHTML = playSVG;
            playTxt.innerHTML = duration;
            timerDisplay.innerHTML = '';
            timerDisplay.classList.add('d-none');
            let t = [...document.querySelectorAll('input[name="peso-aitor"]')].find((x, i) => x.value == '');
            if (t) t.value = duration;
            t = [...document.querySelectorAll('input[name="peso-moi"]')].find((x, i) => x.value == '');
            if (t) t.value = duration;
            isSeriesCompleted('moi');
            isSeriesCompleted('aitor');

        }
    }, 1000);
}

const spreadMoi = document.getElementById('spread-moi');
const resetMoi = document.getElementById('reset-moi');

spreadMoi.onclick = () => {
    let tipo = 'peso';
    if (current.tipo == 'Repeticiones') tipo = 'reps';
    const pesosMoi = [...document.querySelectorAll(`input[name="${tipo}-moi"]`)];
    const pesoDuplicar = pesosMoi.findLast(x => x.value !== '');
    if (pesoDuplicar) {
        pesosMoi.forEach(peso => peso.value = peso.value ? peso.value : pesoDuplicar.value);
        isSeriesCompleted('moi');
    }

}
resetMoi.onclick = () => {
    [...document.querySelectorAll('input[name="peso-moi"]')].forEach(i => i.value = '');
    [...document.querySelectorAll('input[name="reps-moi"]')].forEach(i => i.value = '');

    isSeriesCompleted('moi');
}

const spreadAitor = document.getElementById('spread-aitor');
const resetAitor = document.getElementById('reset-aitor');
spreadAitor.onclick = () => {
    let tipo = 'peso';
    if (current.tipo == 'Repeticiones') tipo = 'reps';
    const pesosAitor = [...document.querySelectorAll(`input[name="${tipo}-aitor"]`)];
    const pesoDuplicar = pesosAitor.findLast(x => x.value !== '');
    if (pesoDuplicar) {
        pesosAitor.forEach(peso => peso.value = peso.value ? peso.value : pesoDuplicar.value);
        isSeriesCompleted('aitor');
    }
}

resetAitor.onclick = () => {
    [...document.querySelectorAll('input[name="peso-aitor"]')].forEach(i => i.value = '');
    [...document.querySelectorAll('input[name="reps-aitor"]')].forEach(i => i.value = '');
    isSeriesCompleted('aitor');
}

const video = document.getElementById('video');
const videoIcon = document.getElementById('video-icon');

const retrieve = document.getElementById('retrieve');

const modalBody = document.querySelector('.modal-body')

retrieve.onclick = () => {
    localStorage.setItem('exercise-to-view', JSON.stringify({ id: current.id, copy: true }));
    retrieve.href = 'view-data.html';
}

const homeBtn = document.getElementById('home');

homeBtn.onclick = () => {
    current.aitor = {};
    current.moi = {};
    current.aitor = [...document.querySelectorAll('input[name="peso-aitor"]')].map(x => x.value);
    current.moi = [...document.querySelectorAll('input[name="peso-moi"]')].map(x => x.value);
    current.repsAitor = [...document.querySelectorAll('input[name="reps-aitor"]')].map(x => x.value);
    current.repsMoi = [...document.querySelectorAll('input[name="reps-moi"]')].map(x => x.value);

    const sensacionAitor = document.querySelector('input[name="sensacion-aitor"]:checked').value;
    const sensacionMoi = document.querySelector('input[name="sensacion-moi"]:checked').value;

    if (sensacionAitor) current.aitorSensacion = sensacionAitor;
    if (sensacionMoi) current.moiSensacion = sensacionMoi;

    current.completado = (isSeriesCompleted('aitor') && isSeriesCompleted('moi')) ? true : false;
    if (isSeriesEmpty('aitor') && isSeriesEmpty('moi')) current.completado = null;
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));

    homeBtn.href = '../index.html';
}

const tempo = document.getElementById('tempo')

let current;
let ejercicios;

loadData();
function loadData() {
    getContext();
    ejercicio.innerHTML = current.nombre;

    if (current.isometrico) {
        tempo.innerHTML = current.tempo;
    } else {
        tempo.innerHTML = current.tempo.reduce((prev, curr) => prev + curr);
        document.getElementById('timer').classList.add('d-none')
    }
    objetivo.value = current.objetivo;
    createReps(current.series, current.isometrico);

    createPeso(current.series, 'aitor', current.tipo);
    createPeso(current.series, 'moi', current.tipo);

    document.getElementById('series').innerHTML = current.series;
    [...document.getElementsByName('reps')].forEach((x, i) => {
        x.innerHTML = current.repeticiones[i];
        [...document.querySelectorAll('input[name="reps-moi"]')][i].value = current.repeticiones[i];
        [...document.querySelectorAll('input[name="reps-aitor"]')][i].value = current.repeticiones[i];
    }
    );

    if (current.repsAitor) [...document.querySelectorAll('input[name="reps-aitor"]')].forEach((x, i) => x.value = current.repsAitor[i])
    if (current.repsMoi) [...document.querySelectorAll('input[name="reps-moi"]')].forEach((x, i) => x.value = current.repsMoi[i])

    if (current.aitor) [...document.querySelectorAll('input[name="peso-aitor"]')].forEach((x, i) => x.value = current.aitor[i])
    if (current.moi) [...document.querySelectorAll('input[name="peso-moi"]')].forEach((x, i) => x.value = current.moi[i])

    if (current.aitorSensacion) document.querySelectorAll('input[name="sensacion-aitor"]')[parseInt(current.aitorSensacion - 1)].checked = true;
    if (current.moiSensacion) document.querySelectorAll('input[name="sensacion-moi"]')[parseInt(current.moiSensacion - 1)].checked = true;

    const dataToCopy = JSON.parse(localStorage.getItem('data-to-copy'));
    if (dataToCopy) {
        [...document.querySelectorAll('input[name="peso-aitor"]')].forEach((x, i) => x.value = dataToCopy.pesosAitor[i]);
        [...document.querySelectorAll('input[name="peso-moi"]')].forEach((x, i) => x.value = dataToCopy.pesosMoi[i]);
    }

    isSeriesCompleted('moi');
    isSeriesCompleted('aitor');

    playTxt.innerHTML = parseInt([...document.getElementsByName('reps')][0].innerHTML);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function isSeriesCompleted(user) {
    let tipo = 'peso';
    if (current.tipo == 'Repeticiones') tipo = 'reps';
    const seriesValues = [...document.querySelectorAll(`input[name="${tipo}-${user}"]`)];
    const isCompleted = seriesValues.filter(x => x.value == '').length > 0 ? false : true;
    if (isCompleted) {
        // document.getElementById(`container-${user}`).style.setProperty('border', '1px solid var(--light-green)', 'important');;
        document.getElementById(`badge-${user}`).classList.remove('d-none');
    } else {
        // document.getElementById(`container-${user}`).style.setProperty('border', '1px solid #dee2e6', 'important');;
        document.getElementById(`badge-${user}`).classList.add('d-none');
    }

    return isCompleted;
}

function isSeriesEmpty(user) {
    let tipo = 'peso';
    if(current.tipo == 'Repeticiones') tipo = 'reps';
    return [...document.querySelectorAll(`input[name="${tipo}-${user}"]`)].every(x => x.value === '');
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
        div.classList.add('flex-fill', 'w-50', 'bg-white', 'px-2', 'py-1', 'rounded-1');
        div.innerHTML = `
        <div for="reps-${i}" class="text-muted fw-bold fs-8">${text} ${i}</div>
        <div class="fw-bolder fs-5" name="reps" id="reps-${i}">5</div>
        
        `;
        repsContainer.appendChild(div);
    }
}

function createPeso(num, user, tipo) {
    if (user == 'aitor') aitorWeightContainer.innerHTML = '';
    if (user == 'moi') moiWeightContainer.innerHTML = '';
    num++;
    if (tipo == 'Repeticiones') tipo = 'd-none';

    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');

        div.innerHTML = `<label for="${user}-${i}" class="fs-7 fw-bold d-flex">Reps ${i}</label>
        <input type="number" class="form-control" id="${user}-${i}" placeholder="" value="" required="" name="reps-${user}">
        <label for="${user}-${i}" class="fs-7 fw-bold d-flex ${tipo} mt-2">Peso ${i}</label>
        <input type="number" class="form-control ${tipo}" id="${user}-${i}" placeholder="" value="" required="" name="peso-${user}">`;
        if (user == 'aitor') aitorWeightContainer.appendChild(div);
        if (user == 'moi') moiWeightContainer.appendChild(div);
    }
    document.querySelectorAll(`input[name="peso-${user}"]`).forEach(x => x.addEventListener('input', () => {
        isSeriesCompleted(user);
    }))
}