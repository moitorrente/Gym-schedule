const ejercicioSelect = document.getElementById('exe');
const ejercicioSearch = document.getElementById('exercise-search');
const myModal = document.getElementById('modalSearchExercise');
const searchExerciseText = document.getElementById('search-exercise-text');

let exerciseToView;
let myChart;

function getFromIndexedDB(id) {
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    if (!indexedDB) {
        alert.log(`Your browser doesn't support IndexedDB`);
        return;
    }
    return new Promise(
        function (resolve, reject) {
            const request = indexedDB.open('db-primary', 1);
            request.onerror = (event) => {
                reject(Error(`Database error: ${event.target.errorCode}`))
            }
            request.onsuccess = (event) => {
                const db = event.target.result;
                let res = [];
                const txn = db.transaction(['Log'], 'readonly');
                const store = txn.objectStore('Log');
                const index = store.index('EjercicioID');
                const keyRng = IDBKeyRange.only(id);
                const cursorRequest = index.openCursor(keyRng, "prev");
                cursorRequest.onsuccess = e => {
                    const cursor = e.target.result;
                    if (cursor) {
                        res.push(cursor.value);
                        cursor.continue();
                    }
                }
                txn.oncomplete = function () {
                    db.close();
                    resolve(res)
                };
            }
        }
    )
}

getContext();
function getContext() {
    const listaEjercicios = JSON.parse(localStorage.getItem('listaEjercicios'));
    exerciseToView = localStorage.getItem('exercise-to-view');
    if (exerciseToView) exerciseToView = JSON.parse(exerciseToView);
    listaEjercicios.data.forEach((ejercicio) => {
        createExerciseOption(ejercicio);
        createExerciseList(ejercicio);
    });


    if (exerciseToView) {
        ejercicioSelect.value = parseInt(exerciseToView.id);
        createAllCards(exerciseToView.id)
    }
    //TODO pendiente revisar que no hay datos en indexeddb
    //if (!historicData) document.getElementById('no-data').classList.remove('d-none');
}


myModal.addEventListener('shown.bs.modal', function () {
    searchExerciseText.focus();
})

ejercicioSelect.onmousedown = (e) => {
    e.preventDefault();
}

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

    getFromIndexedDB(id).then(function (reponse) {
        const selectedMoi = reponse.filter(x => x.EjercicioID == id && x.Usuario == 'Moi').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
        const selectedAitor = reponse.filter(x => x.EjercicioID == id && x.Usuario == 'Aitor').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
        document.getElementById('found-items').innerHTML = selectedMoi.length;
        selectedMoi.forEach((x, i) => createCard(selectedMoi[i], selectedAitor[i], i, selectedAitor[0].TipoDato));
        const fechas = selectedAitor.map(x => x.Fecha);
        let filteredAitor = selectedAitor.map(x => Math.max(x.Peso1, x.Peso2, x.Peso3, x.Peso4, x.Peso5));
        let filteredMoi = selectedMoi.map(x => Math.max(x.Peso1, x.Peso2, x.Peso3, x.Peso4, x.Peso5));

        if (selectedAitor[0].TipoDato == 'Repeticiones') {
            filteredAitor = selectedAitor.map(x => Math.max(x.Repeticiones1, x.Repeticiones2, x.Repeticiones3, x.Repeticiones4, x.Repeticiones5));
        }
        if (selectedMoi[0].TipoDato == 'Repeticiones') {
            filteredMoi = selectedMoi.map(x => Math.max(x.Repeticiones1, x.Repeticiones2, x.Repeticiones3, x.Repeticiones4, x.Repeticiones5));
        }
        chart(filteredMoi, filteredAitor, fechas);
        document.querySelectorAll('input[name="btnradio"]').forEach(x => x.onclick = () => chart(document.querySelector('input[name="btnradio"]:checked').value, selectedMoi, selectedAitor))
    }).catch(function (error) {
        alert(error.message);
    });

}

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function createCard(ejercicioMoi, ejercicioAitor, index, tipo) {
    const d = document.createElement('div');
    d.classList.add('d-flex', 'gap-2');

    let contMoi = '';
    let contAitor = '';


    for (let i = 1; i < 6 + 1; i++) {
        let x = `Peso${i}`;
        let y = `Realizadas${i}`;
        if (tipo == 'Repeticiones') {
            x = `Realizadas${i}`
        }
        contMoi += `<div style="width: 2rem; font-size: .7rem"><small class="d-block">${ejercicioMoi[x]}kg@${ejercicioMoi[y]}</small></div>`;
        contAitor += `<div style="width: 2rem; font-size: .7rem""><small class="d-block">${ejercicioAitor[x]}kg@${ejercicioAitor[y]}
        </small></div>`;
    }

    let copyMode = '';

    if (exerciseToView) {
        copyMode = exerciseToView.copy ?
            `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
        ` : '';
    }

    let iconoSensacionAitor;
    let iconoSensacionMoi;

    switch (parseInt(ejercicioAitor.Sensacion)) {
        case 1:
            iconoSensacionAitor = `                                               
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--red)" class="bi bi-emoji-frown b-light-red rounded-circle" viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
        </svg>`;
            break;
        case 2:
            iconoSensacionAitor = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--dark-yellow)" class="bi bi-emoji-expressionless b-light-yellow rounded-circle"
            viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
        </svg>`;
            break;
        case 3:
            iconoSensacionAitor = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--dark-green)" class="bi bi-emoji-smile b-light-green rounded-circle" viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
        </svg>
            `;
            break;

        default:
            iconoSensacionAitor = '';
            break;
    }


    switch (parseInt(ejercicioMoi.Sensacion)) {
        case 1:
            iconoSensacionMoi = `                                               
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--red)" class="bi bi-emoji-frown b-light-red rounded-circle" viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
        </svg>`;
            break;
        case 2:
            iconoSensacionMoi = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--dark-yellow)" class="bi bi-emoji-expressionless b-light-yellow rounded-circle"
            viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
        </svg>`;
            break;
        case 3:
            iconoSensacionMoi = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="var(--dark-green)" class="bi bi-emoji-smile b-light-green rounded-circle" viewBox="0 0 16 16">
            <path
                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path
                d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
        </svg>
            `;
            break;

        default:
            iconoSensacionMoi = '';
            break;
    }



    const contenido = `
    <div class="list-group-item d-flex gap-2 p-2 rounded align-items-center bg-white my-2 border-0 shadow-sm" data-id="${index}">
        <div class="d-flex flex-grow-1 flex-column">
            <div class="d-flex gap-2 mb-2 align-items-center">
            ${copyMode}
            <span class="fs-7 badge text-bg-primary"> ${ejercicioMoi.Mesociclo}</span>
            <span class="fs-7 badge text-bg-primary"> ${ejercicioMoi.Entrenamiento}</span>
            <span class="fs-7 badge text-bg-primary text-center" style="width: 5rem;">${ejercicioMoi.TipoEntrenamiento}</span>

            
            <div class="ms-auto"><small class="fs-7 d-block text-muted">${ejercicioMoi.Fecha}</small></div>
            </div>
            
            <div class="d-flex flex-grow-1 align-items-center ps-2">
                <div class="d-flex flex-grow-1">Aitor</div>
                <div class="d-flex gap-3 text-center">${iconoSensacionAitor}</div>
                <div class="d-flex gap-3 text-center">
                ${contAitor}
                </div>
            </div>
            <div class="d-flex flex-grow-1 align-items-center ps-2">
                <div class="d-flex flex-grow-1">Moi</div>
                <div class="d-flex gap-3 text-center">${iconoSensacionMoi}</div>

                <div class="d-flex gap-3 text-center">
                ${contMoi}
                </div>
            </div>
        </div>
    </div>
    `;

    const d2 = document.createElement('div');
    d2.innerHTML = contenido;

    if (exerciseToView) {
        const pesos = {
            "pesosMoi": [ejercicioMoi.Peso1, ejercicioMoi.Peso2, ejercicioMoi.Peso3, ejercicioMoi.Peso4, ejercicioMoi.Peso5],
            "pesosAitor": [ejercicioAitor.Peso1, ejercicioAitor.Peso2, ejercicioAitor.Peso3, ejercicioAitor.Peso4, ejercicioAitor.Peso5]
        }

        if (exerciseToView.copy) {
            d2.onclick = () => {
                localStorage.setItem('data-to-copy', JSON.stringify(pesos));
                window.location.href = "log-exercise.html";
            }
        }
    }
    document.getElementById('historic-list').appendChild(d2);
}


//------------------------------------------------------------------------------

function chart(dataMoi, dataAitor, fechas) {
    const datasetMoi1 = createDataset('Moi', dataMoi);
    const datasetAitor1 = createDataset('Aitor', dataAitor);

    const data = {
        labels: fechas,
        datasets: [datasetMoi1, datasetAitor1]
    }

    generateChart(data);
}


function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function createDataset(text, data) {
    let borderColor = '#2563eb';
    let backgroundColor = 'rgb(37, 99, 235, 0.2)';
    if (text == 'Aitor') {
        borderColor = '#b91c1c';
        backgroundColor = 'rgb(185, 28, 28, 0.2)'
    }
    const dataset = {
        label: text,
        data: data,
        fill: true,
        borderWidth: 1,
        // tension: .2,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        spanGaps: true,
        cubicInterpolationMode: 'monotone'
    }

    return dataset;
}



function generateChart(data) {

    const ctx = document.getElementById('myChart');


    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    },
                    time: {
                        unit: 'day',
                        parser: 'dd/MM/yyyy',
                    }
                },
                y: {
                    grid: {
                        display: false,
                    },
                    beginAtZero: true,
                }
            }
        }
    });
}