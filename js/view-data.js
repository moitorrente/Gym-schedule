const historicData = JSON.parse(localStorage.getItem('historic'));
const ejercicioSelect = document.getElementById('exe');
const ejercicioSearch = document.getElementById('exercise-search');
const myModal = document.getElementById('modalSearchExercise');
const searchExerciseText = document.getElementById('search-exercise-text');


myModal.addEventListener('shown.bs.modal', function () {
    searchExerciseText.focus()
})

ejercicioSelect.onmousedown = (e) => {
    e.preventDefault();
}

const listaEjercicios = JSON.parse(localStorage.getItem('listaEjercicios'));

listaEjercicios.data.forEach((ejercicio) => {
    createExerciseOption(ejercicio);
    createExerciseList(ejercicio);
});


function createExerciseOption(ejercicio) {
    const option = document.createElement('option');
    option.value = ejercicio.id;
    option.innerHTML = ejercicio.ejercicio;
    option.dataset.tipo = ejercicio.tipo;
    ejercicioSelect.appendChild(option);
}

function createExerciseList(ejercicio) {
    const element = document.createElement('li');
    element.innerHTML = `
            <div class="dropdown-item text-wrap d-flex align-items-center gap-2 py-2" data-tipo="${ejercicio.tipo}" data-id="${ejercicio.id}">
            <span class="d-inline-block bg-success rounded-circle p-1"></span>
            <span>${ejercicio.ejercicio}</span>
            </div>
            `;
    element.onclick = () => {
        ejercicioSelect.value = ejercicio.id;
        createAllCards(ejercicio.id)
        const modal = bootstrap.Modal.getInstance(myModal);
        modal.hide();
    }
    ejercicioSearch.appendChild(element)
}

searchExerciseText.oninput = () => {
    ejercicioSearch.innerHTML = '';
    const ejerciciosEncontrados = find(JSON.parse(localStorage.getItem('listaEjercicios')).data, searchExerciseText.value);

    ejerciciosEncontrados.forEach(ejercicio => {
        const option2 = document.createElement('li');
        option2.innerHTML = `
        <div class="dropdown-item text-wrap d-flex align-items-center gap-2 py-2" data-tipo="${ejercicio.tipo}" data-id="${ejercicio.id}">
        <span class="d-inline-block bg-success rounded-circle p-1"></span>
        <span class="capitalize-first">${ejercicio.ejercicio}</span>
        </div>
        `;
        option2.onclick = () => {
            ejercicioSelect.value = ejercicio.id;
            createAllCards(ejercicio.id);
            const modal = bootstrap.Modal.getInstance(myModal);
            modal.hide();
        }
        ejercicioSearch.appendChild(option2);
    });

    if (ejerciciosEncontrados.length === 0) {
        const option2 = document.createElement('li');
        option2.innerHTML = `
        <div class="dropdown-item text-wrap d-flex align-items-center py-2 gap-2 t-red" disabled>
        <span class="d-inline-block bg-danger rounded-circle p-1"></span>
        No hay ejercicios para esa búsqueda
        </div>
        `;
        ejercicioSearch.appendChild(option2);

    }
};

function find(items, text) {
    return items.filter(item => {
        if (item.ejercicio.toLowerCase().includes(text.toLowerCase())) {
            item.ejercicio = item.ejercicio.toLowerCase().replaceAll(text.toLowerCase(), `<strong><mark class="p-0">${text}</mark></strong>`);
            return item;
        }
        return false;
    });
}

function createAllCards(id) {
    const container = document.getElementById('historic-list');
    container.innerHTML = '';
    const selectedMoi = [...historicData.data.filter(x => x.EjercicioID == id && x.Usuario == 'Moi')].sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
    const selectedAitor = [...historicData.data.filter(x => x.EjercicioID == id && x.Usuario == 'Aitor')].sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });

    selectedMoi.forEach((x, i) => createCard(selectedMoi[i], selectedAitor[i]));

    //TODO corregir que haya ejercicio en uno y no en el otro
}

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function createCard(ejercicioMoi, ejercicioAitor) {
    const d = document.createElement('div');
    d.classList.add('d-flex', 'gap-2');

    let contMoi = '';
    let contAitor = '';


    for (let i = 1; i < 5 + 1; i++) {
        let x = `Peso${i}`;
        contMoi += `<div style="width: 2.5rem;"><small class="d-block">${ejercicioMoi[x]}</small></div>`;
        contAitor += `<div style="width: 2.5rem;"><small class="d-block">${ejercicioAitor[x]}</small></div>`;
    }

    const contenido = `
    <div class="list-group-item d-flex gap-2 p-2 rounded align-items-center bg-white my-2 border">
        <div class="d-flex flex-grow-1 flex-column">
            <div class="d-flex gap-2 mb-2 align-items-center">
            <span class="fs-7 badge rounded-pill text-bg-success">${ejercicioMoi.Mesociclo}</span>
            <span class="fs-7 badge rounded-pill text-bg-primary">${ejercicioMoi.TipoEntrenamiento}</span>
            <div class="ms-auto"><small class="fs-7 d-block text-muted">${ejercicioMoi.Fecha}</small></div>
            </div>
            
            <div class="d-flex flex-grow-1 ps-2">
                <div class="d-flex flex-grow-1">Aitor</div>
                <div class="d-flex gap-3 text-center">
                ${contAitor}
                </div>
            </div>
            <div class="d-flex flex-grow-1 ps-2">
                <div class="d-flex flex-grow-1">Moi</div>
                <div class="d-flex gap-3 text-center">
                ${contMoi}
                </div>
            </div>
        </div>
    </div>
    `;

    const d2 = document.createElement('div')
    d2.innerHTML = contenido;

    document.getElementById('historic-list').appendChild(d2)

}


