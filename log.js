const orden = document.getElementById('order');
const ejercicio = document.getElementById('exe');
const series = document.getElementById('series');
const tempo1 = document.getElementById('tempo1');
const tempo2 = document.getElementById('tempo2');
const tempo3 = document.getElementById('tempo3');
const tempo4 = document.getElementById('tempo4');
const reps1 = document.getElementById('reps1');
const reps2 = document.getElementById('reps2');
const reps3 = document.getElementById('reps3');
const reps4 = document.getElementById('reps4');
const objetivo = document.getElementById('objective');

const u11 = document.getElementById('u1-1');
const u12 = document.getElementById('u1-2');
const u13 = document.getElementById('u1-3');
const u14 = document.getElementById('u1-4');

const u21 = document.getElementById('u2-1');
const u22 = document.getElementById('u2-2');
const u23 = document.getElementById('u2-3');
const u24 = document.getElementById('u2-4');

document.getElementById('save').onclick = () => {
    current.aitor = [u11.value, u12.value, u13.value, u14.value];
    current.moi = [u21.value, u22.value, u23.value, u24.value];
    localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
}

let current;
let ejercicios;
loadData();
function loadData(){
    getCurrent();
    orden.value = current.orden;
    ejercicio.value = current.nombre;
    [tempo1.value, tempo2.value, tempo3.value, tempo4.value ] = current.tempo;
    [reps1.value, reps2.value, reps3.value, reps4.value ] = current.repeticiones;
    series.value = current.series;
}


function getCurrent(){
    const id = localStorage.getItem('current');
    ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    console.log(ejercicios, id);
    current = ejercicios.filter(ejercicio => ejercicio.id == id)[0]
}