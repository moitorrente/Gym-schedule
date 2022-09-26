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
    <a class="list-group-item d-flex gap-3 p-2 rounded">
        <input class="my-0 form-check-input flex-shrink-0 align-self-center" type="checkbox" ${checked} disabled value="" style="font-size: 1.375em;">
        <span class="flex-shrink-0 align-self-center">${order}</span>
        <span class="pt-1 form-checked-content w-100" data-id="${id}" id="start-${id}">
            <strong>${name}</strong>
            <small class="d-block text-muted">Series: ${series}</small>
        </span>
        <span class="align-self-center ms-auto">
        <div class="btn-group">
            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="options-${id}" href="javascript:void(0);">
                <svg  xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
            <ul class="dropdown-menu text-center">
                <li>
                    <button type="button" class="btn btn-primary px-1 my-1 w-75">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                        Editar
                    </button>
                </li>
                <li>
                    <button type="button" class="btn btn-danger px-1 w-75" id="delete-${id}" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eraser" viewBox="0 0 16 16">
                            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"/>
                        </svg>
                        Eliminar
                    </button>
                </li>
            </ul>
            </div>
        </span>
    </a>
    `;

    listaEjercicios.appendChild(d);
    const start = document.getElementById(`start-${id}`);

    start.onclick = () =>{
        localStorage.setItem('current', start.getAttribute('data-id'));
        location.href = "log-exercise.html";
    } 

    const del = document.getElementById(`delete-${id}`);

    del.onclick = () => {
        const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
        const index = ejercicios.findIndex(x => x.id == del.getAttribute('data-id'));
        ejercicios.splice(index, 1);
        localStorage.setItem('ejercicios', JSON.stringify(ejercicios));
        loadExercises();
    }
}

const share = document.getElementById('share');

share.onclick = () => {
    const ejercicios = JSON.parse(localStorage.getItem('ejercicios'));
    const text = ejercicios.map(ejercicio => json2csv(ejercicio)).join('');
    share.href = `https://wa.me?text=${encodeURIComponent(text)}`;
}

function json2csv(ob){
    const date = new Date().toLocaleDateString('en-GB');
    const entrenamiento = '';
    const ejercicio = ob.nombre;
    const orden = ob.orden || '';
    const series = ob.series || '';
    const tempo = ob.tempo.reduce((prev, curr) => prev + curr, '');
    const objetivo = ob.objetivo;

    let repsAitor = ';;;;;;;';
    let repsMoi = ';;;;;;;';
    if(ob.aitor) repsAitor = `${ob.repeticiones[0] || ''};${ob.aitor[0]|| ''};${ob.repeticiones[1] || ''};${ob.aitor[1]|| ''};${ob.repeticiones[2] || ''};${ob.aitor[2]|| ''};${ob.repeticiones[3] || ''};${ob.aitor[3]|| ''}`;
    if(ob.moi) repsMoi = `${ob.repeticiones[0] || ''};${ob.moi[0]|| ''};${ob.repeticiones[1] || ''};${ob.moi[1]|| ''};${ob.repeticiones[2] || ''};${ob.moi[2]|| ''};${ob.repeticiones[3] || ''};${ob.moi[3]|| ''}`;

    const aitor = `${date};${entrenamiento};${orden};${ejercicio};${series};${tempo};${objetivo};Aitor;${repsAitor}`;
    const moi = `${date};${entrenamiento};${orden};${ejercicio};${series};${tempo};${objetivo};Moi;${repsMoi}`;

    return aitor + '\r\n' + moi + '\r\n';           
}