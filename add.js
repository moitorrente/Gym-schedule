const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const objetivo = document.getElementById('objective');
const repsContainer = document.getElementById('reps-container');

const series = document.querySelectorAll('input[name="series"]');
series.forEach(serie => serie.onclick = () => createReps(document.querySelector('input[name="series"]:checked').value));
const isometric = document.getElementById('isometric');


const saveButton = document.getElementById('save');
saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    ejercicio.disabled = false;
    if (ejercicio.value) {
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
        ejercicio.value = current.id;
        ejercicio.disabled = true;
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
        if (ejercicios) current = ejercicios.filter(ejercicio => ejercicio.id == id)[0];
    }

    return current;
}

function createToken() {
    const token = new Object();
    token.orden = orden.value;
    token.nombre = ejercicio.options[ejercicio.selectedIndex].text;
    token.id = ejercicio.value;
    token.series = document.querySelector('input[name="series"]:checked').value ? document.querySelector('input[name="series"]:checked').value : alert('Falta indicar serie');
    token.isometrico = isometric.checked;
    token.tempo = isometric.checked ? 'Isométrico' : [...document.querySelectorAll('input[name="tempo"]')].map(x => x.value);
    token.repeticiones = [...document.querySelectorAll('input[name="reps"]')].map(x => x.value)
    token.objetivo = objetivo.value;

    return token;
}

function SaveDataToLocalStorage(data) {
    let ejercicios = JSON.parse(localStorage.getItem('ejercicios')) || [];

    const index = ejercicios.findIndex(x => x.id == data.id);
    if (index > -1) {
        ejercicios.splice(index, 1);
    }
    ejercicios.push(data);
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
}

function createReps(num) {
    repsContainer.innerHTML = '';
    num++;
    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('col-3');
        div.innerHTML = `<label for="reps-${i}" class="form-label fw-bold">Rep ${i}</label>
        <input type="text" class="form-control" id="reps-${i}" placeholder="" value="" required="" name="reps" maxlength="2">`;
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
