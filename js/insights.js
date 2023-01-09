import getAllFromIndexedDB from './db.js';

const periodoTexto = document.getElementById('periodo-texto');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');

const prevTime = document.getElementById('prev-time');
prevTime.onclick = () => {
    calculateNextPrev(-1);
}
const nextTime = document.getElementById('next-time');
nextTime.onclick = () => {
    calculateNextPrev(1);
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let dateFromValue = false;
let dateToValue = 9999999999999;
let currentTime = {
    start: 0,
    finish: 0,
    tipo: ''
}
dateFrom.onchange = () => {
    if (dateFrom.value == '') {
        dateFromValue = false;
    } else {
        dateFromValue = new Date(dateFrom.value);
        dateFromValue.setHours(0, 0, 0, 0);
    }
    getContext();
}
dateTo.onchange = () => {
    if (dateTo.value == '') {
        dateToValue = 9999999999999;
    } else {
        dateToValue = new Date(dateTo.value);
        dateToValue.setHours(0, 0, 0, 0);
    }
    getContext();
}

function setDateFrom(date) {

    dateFromValue = new Date(date);
    dateFromValue.setHours(0, 0, 0, 0);
    currentTime.start = dateFromValue;
}

function setDateTo(date) {
    dateToValue = new Date(date);
    dateToValue.setHours(0, 0, 0, 0);
    currentTime.finish = dateTo.value;
}

const periodos = document.querySelectorAll('input[name="periodo"]');
periodos.forEach(periodo => periodo.onclick = () => {
    currentTime.tipo = periodo.value;

    const { start, finish, title, tipo } = getDates(periodo.value, new Date());
    periodoTexto.innerHTML = title;
    console.log(start, finish, title, tipo)
    setDateFrom(convertToDate(start));
    setDateTo(convertToDate(finish));

    getContext(tipo);
});

function calculateNextPrev(sentido) {
    let d = new Date(currentTime.start);

    if (currentTime.tipo === 'semana') {
        if (sentido < 0) {
            d.setDate(d.getDate() - 7);

        } else {
            d.setDate(d.getDate() + 7);

        }
        const { start, finish, title, tipo } = getDates('semana', d);
        currentTime.start = start;
        currentTime.finish = finish;
        periodoTexto.innerHTML = title;
        setDateFrom(convertToDate(currentTime.start));
        setDateTo(convertToDate(currentTime.finish));
        getContext(tipo);
    }

    if (currentTime.tipo === 'mes') {
        if (sentido < 0) {
            d.setMonth(d.getMonth() - 1);
        } else {
            d.setMonth(d.getMonth() + 1);
        }
        const { start, finish, title, tipo } = getDates('mes', d);
        currentTime.start = start;
        currentTime.finish = finish;
        periodoTexto.innerHTML = title;
        setDateFrom(convertToDate(currentTime.start));
        setDateTo(convertToDate(currentTime.finish));
        getContext(tipo);
    }

    if (currentTime.tipo === 'año') {

        if (sentido < 0) {
            d.setDate(d.getDate() - 365);
        } else {
            d.setDate(d.getDate() + 365);
        }
        const { start, finish, title, tipo } = getDates('año', d);
        currentTime.start = start;
        currentTime.finish = finish;
        periodoTexto.innerHTML = title;
        setDateFrom(convertToDate(currentTime.start));
        setDateTo(convertToDate(currentTime.finish));
        getContext(tipo);
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


function getDates(type, fecha) {
    if (type === 'semana') {
        const firstDay = fecha.getDate() - fecha.getDay() + 1;
        const lastDay = addDays(new Date(`${fecha.getMonth() + 1}/${firstDay}/${fecha.getFullYear()}`), 6);
        return { start: `${firstDay}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, finish: `${lastDay.getDate()}/${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`, title: `${firstDay}/${fecha.getMonth() + 1}/${fecha.getFullYear()} - ${lastDay.getDate()}/${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`, tipo: 'diary' }
    }
    if (type === 'mes') {
        const lastDay = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
        return { start: (`01/${fecha.getMonth() + 1}/${fecha.getFullYear()}`), finish: (`${lastDay}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`), title: MONTHS[fecha.getMonth()] + ' ' + fecha.getFullYear(), tipo: 'diary' }
    }
    if (type === 'año') {
        const year = fecha.getFullYear();
        return { start: (`01/01/${year}`), finish: (`31/12/${year}`), title: year, tipo: 'monthly' }
    }
    if (type === 'siempre') {
        return { start: ('01/01/2022'), finish: ('31/12/2050'), title: 'Siempre', tipo: 'monthly' }
    }
}

let historic;
let dates;
let res = getDates('siempre', new Date());
currentTime.start = res.start;
currentTime.finish = res.finish;
getContext();
async function getContext(type = 'monthly') {
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


        let uniqueTrainings = historic.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.Fecha === value.Fecha
            ))
        );

        uniqueTrainings = uniqueTrainings.filter(date => convertToDate(date.Fecha) >= dateFromValue && convertToDate(date.Fecha) <= dateToValue);

        let totalTime = uniqueTrainings.map(x => parseInt(x.Tiempo)).filter(x => x);
        const numberOfTime = parseInt(totalTime.length);
        totalTime = totalTime.reduce((prev, curr) => prev + curr, 0);
        let averageTime = totalTime / numberOfTime;
        document.getElementById('average-time').innerHTML = toMinutes(averageTime);
        document.getElementById('total-time').innerHTML = toMinutes(totalTime);

        if (filteredDates) {
            filteredDates = filteredDates.sort(function (a, b) { return new Date(convertToDate(a)) - new Date(convertToDate(b)) });
            document.getElementById('trained-days').innerHTML = filteredDates.length;
            document.getElementById('first-training').innerHTML = filteredDates[0] ? filteredDates[0] : 'N/D';
            document.getElementById('last-training').innerHTML = filteredDates[filteredDates.length - 1] ? filteredDates[filteredDates.length - 1] : 'N/D';
            if (type == 'monthly') createChartByMonth(filteredDates);
            if (type == 'diary') createChartByWeekday(filteredDates);

        } else {
            document.getElementById('trained-days').innerHTML = 'N/D';
        }
    }).catch(function (error) {
        alert(error.message);
    });
}

function createChartByWeekday(dates) {

    let daysOfWeek = dates.map(date => {
        let d = convertToDate(date).getDay();
        if (d === 0) d = 7;
        return d;
    });

    daysOfWeek = daysOfWeek.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
    for (let i = 1; i < 7; i++) if (!daysOfWeek[i]) daysOfWeek[i] = 0;

    daysOfWeek = Object.values(daysOfWeek);

    const dataset = createDataset('# Veces', daysOfWeek);
    const data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [dataset]
    }
    generateChart(data);
}

function createChartByMonth(dates) {
    let monthTimes = dates.map(date => {
        return convertToDate(date).getMonth();
    });

    monthTimes = monthTimes.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});

    for (let i = 0; i < 12; i++) if (!monthTimes[i]) monthTimes[i] = 0;
    monthTimes = Object.values(monthTimes);

    const dataset = createDataset('# Veces', monthTimes);
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [dataset]
    }
    generateChart(data);
}



function toMinutes(time) {
    if (isNaN(time) || time === 0) return 'N/D';
    const minutes = Math.floor(time / 60);
    if (minutes > 60) {
        return toHours(minutes);
    }

    return `${minutes}min`;
}

function toHours(time) {
    if (isNaN(time)) return 'N/D';
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60)
    return `${hours}h ${minutes}min`;
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
        borderRadius: 5,
        borderSkipped: false,
        barThickness: 18
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

