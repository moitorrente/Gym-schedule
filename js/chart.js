let data;

function getContext() {
    const historicData = JSON.parse(localStorage.getItem('historic'));
    const raw = historicData.data.filter(x => x.Usuario == 'Moi' && x.EjercicioID == localStorage.getItem('exercise-to-view'));
    let fechas = raw.map(x => x.Fecha)//.sort(function (a, b) { return new Date(convertToDate(a)) - new Date(convertToDate(b)) });
    let datos = raw.map(x => x.Peso1);

    const dataset = createDataset('Moi', datos);

    data = {
        labels: fechas,
        datasets: [dataset]
    }

    generateChart(data)
}

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function createDataset(text, data) {
    const dataset = {
        label: text,
        data: data,
        borderWidth: 1
    }

    return dataset;
}

function generateChart(data) {

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        parser: 'dd/MM/yyyy',

                        // displayFormats: {
                        //     'day': 'dd/MM/yyyy'
                        // }
                    }
                }
            }
        }
    });
}
