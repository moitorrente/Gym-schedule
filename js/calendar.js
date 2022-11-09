const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let currentMonth;
let currentYear;

const calendarContainer = document.getElementById('calendar-container');
const monthName = document.querySelector('.cal-month-name');
const selectedTraining = document.getElementById('selected-training');


createMonth(new Date());

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

const accordionBody = document.querySelector('.accordion-body');

function createDay(day, month, year) {
    const historic = JSON.parse(localStorage.getItem('historic'));
    const b = document.createElement('button');
    b.classList.add('btn', 'cal-btn');
    b.innerHTML = day;

    b.dataset.day = `${day.toString().padStart(2, '0')}/${month}/${year}`;
    let found = false;
    let list = [];
    if (historic) {
        found = historic.data.find(value => value.Fecha == b.dataset.day);


        if (found) {
            b.classList.add('btn-primary', 'text-white');

            const colorString = `${found.Mesociclo}${found.Entrenamiento}${found.TipoEntrenamiento}`;

            const COLORES = [
                { clave: '1ACarga', color: '#a5b4fc' },
                { clave: '1BCarga', color: '#6366f1' },
                { clave: '1CCarga', color: '#4338ca' },
                { clave: '1DCarga', color: '#312e81' },
                { clave: '1ADescarga', color: '#fda4af' },
                { clave: '1BDescarga', color: '#f43f5e' },
                { clave: '1CDescarga', color: '#be123c' },
                { clave: '1DDescarga', color: '#881337' },
                { clave: '2ACarga', color: '#93c5fd' },
                { clave: '2BCarga', color: '#3b82f6' },
                { clave: '2CCarga', color: '#1d4ed8' },
                { clave: '2DCarga', color: '#1e3a8a' }];

            const color = COLORES.find(x => x.clave === colorString)


            b.style.backgroundColor = color.color;
        }
        list = historic.data.filter(value => value.Fecha == b.dataset.day && value.Usuario === 'Aitor');
    }
    b.onclick = () => {
        const text1 = found ? found.Entrenamiento : 'N/D';
        const text2 = found ? found.Mesociclo : 'N/D';
        selectedTraining.innerHTML = `Tipo: ${text1} - Mesociclo: ${text2}`;
        let desc = '';

        list.forEach(item => {
            desc += `<li class="fs-7">
                ${item.Orden} - ${item.Ejercicio}
            </li>`
        })
        accordionBody.innerHTML = desc;
    }
    return b;
}

