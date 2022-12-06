const exercisesContainer = document.getElementById('exercises-container');

getContext()
function getContext() {
    let data = localStorage.getItem('exercises-to-list');
    if (data) {
        data = JSON.parse(data);
        console.log(data)
        exercisesContainer.innerHTML = '';
        document.getElementById('entrenamiento-nombre').innerHTML = data.nombre;
        document.getElementById('entrenamiento-mesociclo').innerHTML = data.mesociclo;
        document.getElementById('entrenamiento-tipo').innerHTML = data.tipo;
        data.ejercicios.forEach(exercise => createCard(exercise.nombre, exercise.orden, exercise.series, exercise.tempo, exercise.isometrico))
    }
}

function createCard(nombre, orden, series, tempo, isometrico) {
    const tempoText = isometrico ? tempo : tempo.join('');
    const d = document.createElement('div');
    d.innerHTML =
        `
    <div class="bg-white list-group-item d-flex gap-2 p-3 rounded align-items-center border-0 shadow-sm mt-1 mb-2" style="height: 4.2rem;">
        <div class="form-checked-content w-100 fs-7 d-flex align-items-center">
            <div>
                <div class="align-self-center fw-bold">${nombre}</div>
                <div>Orden: ${orden} - Series: ${series} - Tempo: ${tempoText}</div>
             </div>
            </div>
    </div>
    `;
    exercisesContainer.append(d);
}

