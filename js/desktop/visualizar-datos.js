const datasetSelect = document.getElementById('dataset-select');
const cargaSelect = document.getElementById('carga-select');
cargaSelect.oninput = () => createChart(ejercicioSelect.value, userSelect.value, datasetSelect.value, cargaSelect.value);

const ejercicioSelect = document.getElementById('ejercicio-select');
ejercicioSelect.oninput = () => createChart(ejercicioSelect.value, userSelect.value, datasetSelect.value, cargaSelect.value);
const ejercicios = JSON.parse(localStorage.listaEjercicios).data;
ejercicios.forEach(ejercicio => {
    const option = document.createElement('option');
    option.value = ejercicio.id;
    option.innerHTML = ejercicio.ejercicio
    document.getElementById('ejercicio-select').appendChild(option)
})

const userSelect = document.getElementById('user');
userSelect.oninput = () => createChart(ejercicioSelect.value, userSelect.value, datasetSelect.value, cargaSelect.value)
datasetSelect.oninput = () => createChart(ejercicioSelect.value, userSelect.value, datasetSelect.value, cargaSelect.value)

createChart(ejercicioSelect.value, userSelect.value, datasetSelect.value, cargaSelect.value)
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

let myChart;




function createChart(id, user, dataset, carga) {

    getFromIndexedDB(id).then(function (reponse) {
        let selectedMoi = reponse.filter(x => x.EjercicioID == id && x.Usuario == 'Moi').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
        let selectedAitor = reponse.filter(x => x.EjercicioID == id && x.Usuario == 'Aitor').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });

        if (carga == 'Carga' || carga == 'Descarga') {
            selectedMoi = selectedMoi.filter(x => x.TipoEntrenamiento == carga);
            selectedAitor = selectedAitor.filter(x => x.TipoEntrenamiento == carga);
        }

        chart(selectedMoi, selectedAitor, user, dataset);
    }).catch(function (error) {
        alert(error.message);
    });
}

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function chart(dataMoi, dataAitor, user, dataset) {
    const rawMoi = dataMoi;
    const rawAitor = dataAitor;
    const fechas = rawAitor.map(x => x.Fecha);
    let datosMoi1 = rawMoi.map(x => x[dataset]);
    let datosAitor1 = rawAitor.map(x => x[dataset]);

    datosMoi1 = datosMoi1.map(x => x === '' ? NaN : x);
    datosAitor1 = datosAitor1.map(x => x === '' ? NaN : x);

    const datasetMoi1 = createDataset('Moi', datosMoi1);
    const datasetAitor1 = createDataset('Aitor', datosAitor1);

    let data;

    if (user == 'Moi') {
        data = {
            labels: fechas,
            datasets: [datasetMoi1]
        }
    }
    if (user == 'Aitor') {
        data = {
            labels: fechas,
            datasets: [datasetAitor1]
        }
    }
    if (user == 'ambos') {
        data = {
            labels: fechas,
            datasets: [datasetMoi1, datasetAitor1]
        }
    }

    generateChart(data);

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
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    ticks: {
                        display: true
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
                        display: true,
                    },
                    beginAtZero: true,
                }
            }
        }
    });
}