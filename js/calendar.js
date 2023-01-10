import getAllFromIndexedDB from './db.js';

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let currentMonth;
let currentYear;

const calendarContainer = document.getElementById('calendar-container');
const monthName = document.querySelector('.cal-month-name');

function createMonth(date) {
    calendarContainer.innerHTML = '';
    const month = monthInfo(date);
    currentMonth = month.month;
    currentYear = month.year;
    monthName.innerHTML = month.name;

    if (month.firstDayIndex == 0) month.firstDayIndex = 7;

    for (let i = 0; i < month.firstDayIndex - 1; i++) {
        calendarContainer.appendChild(createPlaceholder())
    }
    for (let i = 1; i < month.numberDays + 1; i++) {
        calendarContainer.appendChild(createDay(i, month.month, month.year))
    }
}

document.getElementById('prev-month').onclick = () => {
    currentMonth = parseInt(currentMonth) - 1;
    if (currentMonth <= 0) {
        currentMonth = 12;
        currentYear--;
    }
    currentMonth = currentMonth.toString().padStart(2, '0');
    createMonth(new Date(`${currentMonth}/01/${currentYear}`));
}
document.getElementById('next-month').onclick = () => {
    currentMonth = parseInt(currentMonth) + 1;
    if (currentMonth >= 13) {
        currentMonth = 1;
        currentYear++;
    }
    currentMonth = currentMonth.toString().padStart(2, '0');
    createMonth(new Date(`${currentMonth}/01/${currentYear}`));
}




function monthInfo(time) {
    const date = new Date(time);
    let monthValue = date.getMonth() + 1;
    monthValue = monthValue.toString().padStart(2, '0');
    return {
        firstDayIndex: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        firstDay: new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0],
        numberDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        name: MONTHS[date.getMonth()] + ' ' + date.getFullYear(),
        month: monthValue,
        year: date.getFullYear()
    };
}

function createPlaceholder() {
    const b = document.createElement('button');
    b.classList.add('btn', 'cal-btn');
    return b;
}

function createDay(day, month, year) {
    const b = document.createElement('button');
    b.classList.add('btn', 'cal-btn');
    b.innerHTML = day;

    b.dataset.day = `${day.toString().padStart(2, '0')}/${month}/${year}`;
    let found = false;
    if (dates) {
        found = historic.find(value => value.Fecha == b.dataset.day);


        if (found) {
            b.classList.add('btn-primary', 'text-white');
            b.style.backgroundColor = '#2563eb';
        }
    }
    return b;
}


let dates;
let historic;

updateCalendar();
export default function updateCalendar() {
    getAllFromIndexedDB('db-primary', 'Log').then(function (reponse) {
        historic = reponse;
        dates = [...new Set(historic.map(x => x.Fecha))];
        createMonth(new Date());

    }).catch(function (error) {
        console.log(error.message)
        // alert(error.message);
    });
}
