const exercisesContainer = document.getElementById('exercises-container');

getContext()
function getContext() {
    let data = localStorage.getItem('exercises-to-list');
    if (data) {
        data = JSON.parse(data);
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
    <div class="bg-white list-group-item d-flex gap-2 p-3 rounded align-items-center border-0 shadow-sm mt-1 mb-2" style="height: 4.8rem;">
        <div class="form-checked-content w-100 fs-7 d-flex align-items-center">
            <div>
                <div class="align-self-center fw-bold">${nombre}</div>
                <div class="d-flex mt-2 gap-2 fs-7 w-100 align-items-center">
                    <small class="b-light-blue text-center align-self-center t-dark-blue border-rounded rounded-5 px-2" style="min-width: 2rem;"><strong>${orden}</strong></small>
                    <small class="b-light-green text-center align-self-center t-dark-green border-rounded rounded-5 px-2" style="min-width: 3.5rem;">Series: <strong>${series}</strong></small>
                    <small class="b-light-yellow text-center align-self-center t-dark-yellow border-rounded rounded-5 px-2" style="min-width: 4rem;"><strong>${tempoText}</strong></small>
                </div>
            </div>
        </div>
    </div>
    `;
    exercisesContainer.append(d);
}

