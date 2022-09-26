const listaEjercicios = document.getElementById('exercise-list');

document.getElementById('delete').onclick = () => {
    localStorage.clear();
    loadExercises();
}

loadExercises();

function loadExercises() {
    listaEjercicios.innerHTML = ''
    const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    if (ejercicios) {
        ejercicios.forEach(ejercicio => {
            const checked = ejercicio.aitor || ejercicio.moi ? 'checked' : '';
            createNewExercise(ejercicio.orden, ejercicio.nombre, ejercicio.series, ejercicio.id, checked)
        });
    }else{
        const a = document.createElement('a');
        a.innerHTML = 'Añadir ejercicio';
        a.classList.add('text-center', 'my-4', 'py-4')
        a.href = 'add-exercise.html'
        listaEjercicios.appendChild(a)
    }
}

function createNewExercise(order, name, series, id, checked) {
    const d = document.createElement('div');
    d.classList.add('py-1')
    d.innerHTML = `
    <a class="list-group-item d-flex gap-3 p-2 rounded" data-id="${id}" id="start-${id}">
        <input class="my-0 form-check-input flex-shrink-0 align-self-center" type="checkbox" ${checked} disabled value="" style="font-size: 1.375em;">
        <span class="flex-shrink-0 align-self-center">${order}</span>
        <span class="pt-1 form-checked-content">
            <strong>${name}</strong>
            <small class="d-block text-muted">Series: ${series}</small>
        </span>
        <span class="align-self-center ms-auto">
            <svg  xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            </svg>
        </span>
    </a>
    `;

    listaEjercicios.appendChild(d);
    const start = document.getElementById(`start-${id}`);

    start.onclick = () =>{
        localStorage.setItem('current', start.getAttribute('data-id'));
        location.href = "log-exercise.html";
    } 

}

const share = document.getElementById('share');

share.onclick = () => {
    const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    const text = ejercicios.map(ejercicio => json2csv(ejercicio)).join('');

    share.href = `https://wa.me?text=${encodeURIComponent(text)}`
}

function json2csv(ob){
    const date = new Date().toLocaleDateString('en-GB');
    const entrenamiento = '';
    const ejercicio = ob.nombre;
    const orden = ob.orden || '';
    const series = ob.series || '';
    const tempo = ob.tempo.reduce((prev, curr) => prev + curr, '');

    let repsAitor = ';;;;;;;';
    let repsMoi = ';;;;;;;';
    if(ob.aitor) repsAitor = `${ob.repeticiones[0] || ''};${ob.aitor[0]|| ''};${ob.repeticiones[1] || ''};${ob.aitor[1]|| ''};${ob.repeticiones[2] || ''};${ob.aitor[2]|| ''};${ob.repeticiones[3] || ''};${ob.aitor[3]|| ''}`;
    if(ob.moi) repsMoi = `${ob.repeticiones[0] || ''};${ob.moi[0]|| ''};${ob.repeticiones[1] || ''};${ob.moi[1]|| ''};${ob.repeticiones[2] || ''};${ob.moi[2]|| ''};${ob.repeticiones[3] || ''};${ob.moi[3]|| ''}`;

    const aitor = `${date};${entrenamiento};${orden};${ejercicio};${series};${tempo};Aitor;${repsAitor}`;
    const moi = `${date};${entrenamiento};${orden};${ejercicio};${series};${tempo};Moi;${repsMoi}`;

    return aitor + '\r\n' + moi + '\r\n';           
}

