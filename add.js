const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const reps1 = document.getElementById('reps1');
const reps2 = document.getElementById('reps2');
const reps3 = document.getElementById('reps3');
const reps4 = document.getElementById('reps4');
const objetivo = document.getElementById('objective');

const repsContainer = document.getElementById('reps-container')


const series = document.querySelectorAll('input[name="series"]');
series.forEach(x => x.onclick = () => createReps(document.querySelector('input[name="series"]:checked').value))


const saveButton = document.getElementById('save');

saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (ejercicio.value) {
        SaveDataToLocalStorage(createToken())
    } else {
        alert('Selecciona ejercicio');
        document.getElementById('closeModal').click();
    }
});


function createToken() {
    const token = new Object();
    token.orden = orden.value;
    token.nombre = ejercicio.options[ejercicio.selectedIndex].text;
    token.id = ejercicio.value;
    token.series = document.querySelector('input[name="series"]:checked').value ? document.querySelector('input[name="series"]:checked').value : alert('Falta indicar serie');
    token.tempo = [...document.querySelectorAll('input[name="tempo"]')].map(x => x.value);
    token.repeticiones = [...document.querySelectorAll('input[name="reps"]')].map(x => x.value)
    token.objetivo = objetivo.value;

    return token;

}

function SaveDataToLocalStorage(data) {
    let a = JSON.parse(localStorage.getItem('ejercicios')) || [];
    a.push(data);
    localStorage.setItem('ejercicios', JSON.stringify(a));
}

function createReps(num) {

    repsContainer.innerHTML = '';

    num++;

    for (let i = 1; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('col-3');
        div.innerHTML = `<label for="reps${i}" class="form-label">Rep ${i}</label>
        <input type="text" class="form-control" id="reps${i}" placeholder="" value="" required="" name="reps">`
        repsContainer.appendChild(div);
    }
}
