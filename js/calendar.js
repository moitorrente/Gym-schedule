const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let currentMonth;
let currentYear;

const calendarContainer = document.getElementById('calendar-container');
const monthName = document.querySelector('.cal-month-name')

createMonth(new Date());

document.getElementById('prev-month').onclick = () => {
    currentMonth = parseInt(currentMonth) - 1;
    if(currentMonth <= 0){
        currentMonth = 12;
        currentYear--;
    } 
    currentMonth = currentMonth.toString().padStart(2, '0');
    createMonth(new Date(`${currentMonth}/01/${currentYear}`));
}
document.getElementById('next-month').onclick = () => {
    currentMonth = parseInt(currentMonth) + 1;
    if(currentMonth >= 13){
        currentMonth = 1;
        currentYear++;
    } 
    currentMonth = currentMonth.toString().padStart(2, '0');
    createMonth(new Date(`${currentMonth}/01/${currentYear}`));
}


function createMonth(date) {
    calendarContainer.innerHTML = '';
    const month = monthInfo(date);
    currentMonth = month.month;
    currentYear = month.year;
    monthName.innerHTML = month.name;
    
    for (let i = 0; i < month.firstDayIndex - 1; i++) {
        calendarContainer.appendChild(createPlaceholder())
    }
    for (let i = 1; i < month.numberDays + 1; i++) {
        calendarContainer.appendChild(createDay(i, month.month, month.year))
    }
}

function monthInfo(time) {
    const date = new Date(time);
    let monthValue = date.getMonth() + 1;
    monthValue = monthValue.toString().padStart(2, '0');
    return {
        firstDayIndex: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
        firstDay: new Date(date.getFullYear(), date.getMonth(), 2).toISOString().split('T')[0],
        numberDays: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
        name: MONTHS[date.getMonth()],
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
    const historic = JSON.parse(localStorage.getItem('historic'));
    const b = document.createElement('button');
    b.classList.add('btn', 'cal-btn', 'mb-2');
    b.innerHTML = day;
    b.dataset.day = `${day.toString().padStart(2, '0')}/${month}/${year}`;
    if (historic) {
        const found = historic.data.find(value => value.Fecha == b.dataset.day);
        if (found) b.classList.add('btn-success')
    }
    return b;
}
