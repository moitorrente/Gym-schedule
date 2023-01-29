const exerciseContainer = document.getElementById('exercise-container');

getContext();
function getContext(){
    exerciseContainer.innerHTML = '';
    const exercises = JSON.parse(localStorage.listaEjercicios).data;
    document.getElementById('exercise-count').innerHTML = `Ejercicios: ${exercises.length}`;
    exercises.forEach(exercise => exerciseContainer.appendChild(createCard(exercise.ejercicio, exercise.elemento, exercise.tipo)))

}

function createCard(title, type, element){

    const d = document.createElement('div');


    d.innerHTML = `
        <div class="bg-white list-group-item d-flex gap-2 p-3 rounded align-items-center border-0 shadow-sm mt-1 mb-2"
            style="height: 4.8rem;">
            <div class="form-checked-content w-100 fs-7 d-flex align-items-center">
                <div>
                    <div class="align-self-center fw-bold">${title}</div>
                    <div class="d-flex mt-2 gap-2 fs-7 w-100 align-items-center">
                        <small
                            class="b-light-blue text-center align-self-center t-dark-blue border-rounded rounded-5 px-2"
                            style="min-width: 2rem;"><strong>${element}</strong></small>
                        <small
                            class="b-light-yellow text-center align-self-center t-dark-yellow border-rounded rounded-5 px-2"
                            style="min-width: 4rem;"><strong>${type}</strong></small>
                    </div>
                </div>
            </div>
        </div>
    `;

    return d;

}