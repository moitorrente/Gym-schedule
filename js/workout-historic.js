import getAllFromIndexedDB from "./db.js";

const historicContainer = document.getElementById('historic-container')

getAllFromIndexedDB('db-primary', 'Log').then(function (response) {
    console.log(response)
    // response = response.filter(x => x.Entrenamiento === 'A')
    const historicMoi = response.filter(x => x.Usuario == 'Moi').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
    const historicAitor = response.filter(x => x.Usuario == 'Aitor').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
    historicContainer.innerHTML = '';

    const groupedMoi = historicMoi.reduce(function (r, a) {
        r[a.Fecha] = r[a.Fecha] || [];
        r[a.Fecha].push(a);
        return r;
    }, Object.create(null));
    const groupedAitor = historicAitor.reduce(function (r, a) {
        r[a.Fecha] = r[a.Fecha] || [];
        r[a.Fecha].push(a);
        return r;
    }, Object.create(null));


    Object.keys(groupedMoi).forEach((x, i) => {
        historicContainer.appendChild(createDiv(x, calculateCarga(groupedAitor[x]), calculateCarga(groupedMoi[x]), groupedAitor[x][0], groupedAitor[x], groupedMoi[x]))
    });

    const fechas = Object.keys(groupedMoi);
    const cargasAitor = Object.values(groupedAitor).map(x => calculateCarga(x));
    const cargasMoi = Object.values(groupedMoi).map(x => calculateCarga(x));

    chart(fechas, cargasMoi, cargasAitor)

}).catch(function (error) {
    alert(error.message);
});

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function calculateCarga(list) {
    const valor = list.reduce((acc, value) => {
        if (value.Carga == '') value.Carga = '0';
        return acc + parseFloat(value.Carga.replace(",", "."));
    }, 0);



    if (valor == 0) return null;
    return valor;
}

function createExercise(aitor, moi) {
    const d = document.createElement('div');
    d.classList.add('mt-1', 'b-light-green');

    let iconoSensacionAitor;
    let iconoSensacionMoi;

    switch (parseInt(aitor.Sensacion)) {
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


    switch (parseInt(moi.Sensacion)) {
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

    let textoAitor1 = aitor.Peso1;
    let textoAitor2 = aitor.Peso2;
    let textoAitor3 = aitor.Peso3;
    let textoAitor4 = aitor.Peso4;
    let textoAitor5 = aitor.Peso5;
    let textoMoi1 = moi.Peso1;
    let textoMoi2 = moi.Peso2;
    let textoMoi3 = moi.Peso3;
    let textoMoi4 = moi.Peso4;
    let textoMoi5 = moi.Peso5;

    if (aitor.TipoDato == 'Repeticiones' || aitor.TipoDato == 'Segundos') {

        textoAitor1 = aitor.Realizadas1;
        textoAitor2 = aitor.Realizadas2;
        textoAitor3 = aitor.Realizadas3;
        textoAitor4 = aitor.Realizadas4;
        textoAitor5 = aitor.Realizadas5;

        textoMoi1 = moi.Realizadas1;
        textoMoi2 = moi.Realizadas2;
        textoMoi3 = moi.Realizadas3;
        textoMoi4 = moi.Realizadas4;
        textoMoi5 = moi.Realizadas5;
    }

    d.innerHTML = `
<div class="list-group-item d-flex gap-2 p-2 rounded align-items-center bg-white my-2 border-0 shadow-sm" data-id="1">
    <div class="d-flex flex-grow-1 flex-column">
        <div class="d-flex gap-2 mb-2 align-items-center">
            <span class="fs-7 fw-bold">${aitor.Ejercicio}</span>
        </div>

        <div class="d-flex flex-grow-1 align-items-center ps-2">
            <div class="d-flex flex-grow-1">Aitor</div>
            <div class="d-flex gap-3 text-center">
            ${iconoSensacionAitor}

            </div>
            <div class="d-flex gap-3 text-center">
                <div style="width: 2.5rem;"><small class="d-block">${textoAitor1}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoAitor2}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoAitor3}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoAitor4}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoAitor5}</small></div>
            </div>
        </div>
        <div class="d-flex flex-grow-1 align-items-center ps-2">
            <div class="d-flex flex-grow-1">Moi</div>
            <div class="d-flex gap-3 text-center">
                ${iconoSensacionMoi}
            </div>

            <div class="d-flex gap-3 text-center">
                <div style="width: 2.5rem;"><small class="d-block">${textoMoi1}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoMoi2}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoMoi3}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoMoi4}</small></div>
                <div style="width: 2.5rem;"><small class="d-block">${textoMoi5}</small></div>
            </div>
        </div>
    </div>
</div>`;

    return d.innerHTML;
}

function createDiv(fecha, cargaAitor, cargaMoi, entrenamiento, aitor, moi) {
    const fechaGuiones = fecha.replaceAll('/', '-');
    let dd = '';
    for (let i = 0; i < aitor.length; i++) {
        dd += createExercise(aitor[i], moi[i])
    }

    const newD = document.createElement('div');

    newD.innerHTML = `
    <div class="accordion" id="accordionExercise">

    <div class="accordion-item mb-2 rounded border-0 b-light-blue">
        <h2 class="accordion-header" id="heading">
            <button
                class="accordion-button collapsed list-group-item bg-white d-flex gap-2 py-0 px-4 rounded border-0 shadow-sm"
                type="button" data-bs-toggle="collapse" data-bs-target="#collapseWorkout-${fechaGuiones}" aria-expanded="false"
                aria-controls="collapseWorkout-${fechaGuiones}">
                <a class="list-group-item bg-white d-flex gap-2 py-0 px-0 gap-4 rounded align-items-center border-0"
                    style="height: 5rem">
                    <span class="align-self-center">
                        <div class="fs-5 w-50 p-0" id="badge-moi">
                            <span class="b-light-green t-dark-green d-flex align-items-center rounded-4 w-100"
                                style="width: 1.4rem!important;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                    fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                    <path
                                        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z">
                                    </path>
                                </svg>
                            </span>
                        </div>
                    </span>
                    <span class="pt-1 form-checked-content w-100 fs-6" data-id="47" id="start-47">
                    <strong>${fecha}</strong>
                    <span>- ${entrenamiento.Entrenamiento}</span>
                    <span>- ${entrenamiento.Mesociclo}</span>
                    <div class="d-flex mt-2 gap-2 fs-7 w-100 align-items-center">
                        <small
                            class="b-light-blue text-center align-self-center t-dark-blue border-rounded rounded-5 px-2"
                            style="min-width: 2rem;">Aitor: <strong>${cargaAitor}</strong></small>
                        <small
                            class="b-light-green text-center align-self-center t-dark-green border-rounded rounded-5 px-2"
                            style="min-width: 2rem;">Moi: <strong>${cargaMoi}</strong></small>
                    </div>
                    </span>
                </a>
            </button>
        </h2>
        <div id="collapseWorkout-${fechaGuiones}" class="accordion-collapse collapse b-light-blue p-2" aria-labelledby="heading"
            data-bs-parent="#accordionExercise">
            ${dd}
        </div>
    </div>
</div>
    `;

    return newD;

}

function chart(fechas, datosMoi, datosAitor) {
    const datasetMoi = createDataset('Moi', datosMoi);
    const datasetAitor = createDataset('Aitor', datosAitor);

    const data = {
        labels: fechas,
        datasets: [datasetMoi, datasetAitor]
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
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        spanGaps: true,
        cubicInterpolationMode: 'monotone'
    }

    return dataset;
}


let myChart;
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