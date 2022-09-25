const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const series1 = document.getElementById('series1');
const series2 = document.getElementById('series2');
const series3 = document.getElementById('series3');
const series4 = document.getElementById('series4');
const tempo1 = document.getElementById('tempo1');
const tempo2 = document.getElementById('tempo2');
const tempo3 = document.getElementById('tempo3');
const tempo4 = document.getElementById('tempo4');
const reps1 = document.getElementById('reps1');
const reps2 = document.getElementById('reps2');
const reps3 = document.getElementById('reps3');
const reps4 = document.getElementById('reps4');
const objetivo = document.getElementById('objective');

const saveButton = document.getElementById('save');

saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    SaveDataToLocalStorage(createToken())
});


function createToken() {
    const token = new Object();
    token.orden = orden.value;
    token.nombre = ejercicio.options[ejercicio.selectedIndex].text;
    token.id = ejercicio.value;
    token.series = series1.checked ? 1 : series2.checked ? 2 : series3.checked ? 3 : series4.checked ? 4 : alert('Falta indicar serie');
    token.tempo = [tempo1.value, tempo2.value, tempo3.value, tempo4.value];
    token.repeticiones = [reps1.value, reps2.value, reps3.value, reps4.value];
    token.objetivo = objetivo.value;

    return token;

}

function SaveDataToLocalStorage(data) {
    let a = JSON.parse(localStorage.getItem('ejercicios')) || [];
    a.push(data);
    localStorage.setItem('ejercicios', JSON.stringify(a));
}
