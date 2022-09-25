const listaEjercicios = document.getElementById('exercise-list');

document.getElementById('delete').onclick = () => localStorage.clear();

loadExercises();

function loadExercises() {
    const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    console.log(ejercicios)
    if (ejercicios) {
        ejercicios.forEach(ejercicio => {
            createNewExercise(ejercicio.orden, ejercicio.nombre, ejercicio.tempo, `${ejercicio.repeticiones[0]} - ${ejercicio.repeticiones[1]} - ${ejercicio.repeticiones[2]} - ${ejercicio.repeticiones[3] || ''}`, ejercicio.id)
        });
    }
}

function createNewExercise(order, name, tempo, reps, id) {
    const d = document.createElement('div');
    d.innerHTML = `
    <label class="list-group-item d-flex gap-3">
        <input class="form-check-input flex-shrink-0" type="checkbox" value="" checked="" style="font-size: 1.375em;">
        <span class="pt-1 form-checked-content">
            <strong>${order}</strong>
            <strong>${name}</strong>
            <small class="d-block text-muted">${tempo}</small>
            <small class="d-block text-muted">${reps}</small>
        </span>
        <a class="btn btn-primary btn-sm start" href="log-exercise.html" data-id="${id}" id="start-${id}">Empezar</a>
    </label>
    `;

    listaEjercicios.appendChild(d);
    const start = document.getElementById(`start-${id}`);

    start.onclick = () =>{
        localStorage.setItem('current', start.getAttribute('data-id'));
    } 

}

const share = document.getElementById('share');

share.onclick = () => {
    const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    const text = ejercicios.map(ejercicio => json2csv(ejercicio));

    share.href =  `https://wa.me?text=${encodeURIComponent(text.join(''))}`
}

function json2csv(ob){
    return ob.orden + ';' +
           ob.nombre + ';' + 
           ob.series + ';' +
           ob.tempo[0] + ob.tempo[1] + ob.tempo[2] + ob.tempo[3] + ';' +
           'Aitor;' + 
           ob.repeticiones[0] + ';' +
           ob.aitor[0] + ';' +
           ob.repeticiones[1] + ';' +
           ob.aitor[1] + ';' +
           ob.repeticiones[2] + ';' +
           ob.aitor[2] + ';' +
           ob.repeticiones[3] + ';' +
           ob.aitor[3] + ';' + '\r\n' + 

           ob.orden + ';' +
           ob.nombre + ';' + 
           ob.series + ';' +
           ob.tempo[0] + ob.tempo[1] + ob.tempo[2] + ob.tempo[3] + ';' +
           'Moi;' + 
           ob.repeticiones[0] + ';' +
           ob.moi[0] + ';' +
           ob.repeticiones[1] + ';' +
           ob.moi[1] + ';' +
           ob.repeticiones[2] + ';' +
           ob.moi[2] + ';' +
           ob.repeticiones[3] + ';' +
           ob.moi[3] + ';' + '\r\n' 

           
}