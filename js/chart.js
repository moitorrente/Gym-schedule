getContext();
function getContext() {
    const dataset = createDataset('# Veces', [1, 2, 3, 4, 5, 2, 8]);
    data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
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
        // borderWidth: 1
    }
    return dataset;
}

function generateChart(data) {

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options:
        {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }

            },
            plugins: {
                legend:
                {
                    display: false
                }
            }
        }

    });
}
