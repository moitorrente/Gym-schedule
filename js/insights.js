import getAllFromIndexedDB from './db.js';

const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
let dateFromValue = false;
let dateToValue = 9999999999999;
dateFrom.onchange = () => {
    if (dateFrom.value == '') {
        dateFromValue = false;
    } else {
        dateFromValue = new Date(dateFrom.value);
    }
    getContext();
}
dateTo.onchange = () => {
    if (dateTo.value == '') {
        dateToValue = 9999999999999;
    } else {
        dateToValue = new Date(dateTo.value);
    }
    getContext();
}

let historic;
let dates;
let unixDates;
getContext();
async function getContext() {
    getAllFromIndexedDB('db-primary', 'Log').then(function (reponse) {
        historic = reponse;
        dates = [...new Set(historic.map(x => x.Fecha))];
        let filteredDates = dates.map(x => convertToDate(x));
        filteredDates = filteredDates.filter(date => date >= dateFromValue && date <= dateToValue);
        filteredDates = filteredDates.map(date => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`
        });

        createYearView(dates);

        if (filteredDates) {
            filteredDates = filteredDates.sort(function (a, b) { return new Date(convertToDate(a)) - new Date(convertToDate(b)) });
            document.getElementById('trained-days').innerHTML = filteredDates.length;
            document.getElementById('first-training').innerHTML = filteredDates[0];
            document.getElementById('last-training').innerHTML = filteredDates[filteredDates.length - 1];
            unixDates = filteredDates.map(date => convertToUnix(convertToDate(date)));

            let daysOfWeek = filteredDates.map(date => {
                let d = convertToDate(date).getDay();
                if (d === 0) d = 7;
                return d;
            });

            daysOfWeek = daysOfWeek.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
            daysOfWeek = Object.values(daysOfWeek);

            const dataset = createDataset('# Veces', daysOfWeek);
            const data = {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [dataset]
            }
            generateChart(data);


        } else {
            document.getElementById('trained-days').innerHTML = 'N/D';
        }
    }).catch(function (error) {
        alert(error.message);
    });
}

function convertToUnix(date) {
    return Math.floor(new Date(date).getTime() / 1000)
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
        backgroundColor: ['#2563eb'],
        borderRadius: 5

        // borderWidth: 1
    }
    return dataset;
}
let myChart;
function generateChart(data) {

    const ctx = document.getElementById('dayDistributionChart');

    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
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

//-------------------------------------------------------------------
const yearView = document.getElementById('year-view');

function createYearView(days) {
    let gone = [];
    if (days) {
        days.forEach(day => gone.push(dayOfYear(stringToDate(day))))
    }

    const today = dayOfYear(new Date());
    gone = [...new Set(gone)];
    yearView.innerHTML = '';
    for (let i = today - 174; i < today; i++) {
        const day = document.createElement('span');
        day.classList.add("d-inline-block", "rounded-square", "p-s");
        if (gone.includes(i + 1)) {
            day.classList.add('b-blue');
        } else {
            day.classList.add('b-light-blue')
        }
        yearView.appendChild(day)
    }
}

function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date([month, day, year].join('/'));
};


function dayOfYear(day) {
    let date = new Date(day);
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
}
//-------------------------------------------------------------------
